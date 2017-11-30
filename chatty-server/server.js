require('dotenv').config()
const giphyAPI = process.env.GIPHY_API_KEY;
const express = require('express');
const WebSocket = require('ws');
const uuidv1 = require('uuid/v1');
const http = require('http');
const querystring = require('querystring');
const PORT = 8000;

const server = express()
              .use(express.static('public'))
              .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${ PORT }`));

const wss = new WebSocket.Server({ server });

// handles broadcasting the message.
wss.broadcast_message = (msg) => {
  for(const client of wss.clients){
    if(client.readyState === WebSocket.OPEN){
      client.send(msg);
    }
  }
}

// sends an invidiual message
wss.send_message = (socket, msg) => {
  socket.send(msg);
}

// tallies up users
wss.tally_users = (usersOnline) => {
  const message = {
    type: 'USER_TALLY',
    usersOnline
  };
  // don't need a socket here
  wss.broadcast_message(JSON.stringify(message));
}

// Updates a user's style
wss.send_user_id = (socket, id) => {
  const message = {
    type: 'ID_ASSIGN',
    id
  }
  wss.send_message(socket, JSON.stringify(message));
}
wss.user_styles = {};

// saves user to 'database'
wss.save_user = (userId) => {
  const colors = ['blue', 'yellow', 'grey', 'tomato'];
  const userColor = colors[Math.floor(Math.random()*colors.length)];
  wss.user_styles[userId] = {color:userColor};
}

// gets a random giphy image based on a query
wss.get_giphy = (parsedMessage) => {
  const giphySearchArr = parsedMessage.content.split(' ');
  giphySearchArr.shift();
  const giphySearch = giphySearchArr.join(' ');

  http.get(`http://api.giphy.com/v1/gifs/random?api_key=${giphyAPI}&tag=${querystring.escape(giphySearch)}`, res => {
    let gifObj = '';
    res.on('data', chunk => {
      gifObj += chunk;
    });
    res.on('end', () => {
      parsedMessage.content = JSON.parse(gifObj).data.image_url
      console.log(JSON.parse(gifObj));
      parsedMessage.file = true;
      wss.broadcast_message(JSON.stringify(parsedMessage));
    })
  });
}


wss.on('connection', (socket) => {
  const userId = uuidv1();
  wss.save_user(userId);
  wss.send_user_id(socket, userId);
  wss.tally_users(wss.clients.size);

  socket.on('message', (msg) => {
    const parsedMessage = JSON.parse(msg);
    let color = null;
    console.log(parsedMessage);
    // check for easter eggs
    if(parsedMessage.type === 'NOTIFICATION'){
      if(parsedMessage.username === 'HULK'){
        wss.user_styles[userId] = {color:'#158202', fontSize:'1.2em'};
      }
    }

    if(parsedMessage.type === 'MESSAGE'){
      // assigning user styling to message
      parsedMessage.style = wss.user_styles[userId];
      const reImage = /^[\w\:\/\.\@]+\.(jpg|gif|png)$/;
      const reGiphy = /^\/giphy/;

      // check if image link sent
      if(reImage.test(parsedMessage.content)){
        parsedMessage.file = true;
      }

      // handle giphy
      if(reGiphy.test(parsedMessage.content)){
        wss.get_giphy(parsedMessage);
        return;
      }
    }
    wss.broadcast_message(JSON.stringify(parsedMessage))
  });

  socket.on('close', () => {
    wss.tally_users(wss.clients.size);
    delete wss.user_styles[userId];
  })
});

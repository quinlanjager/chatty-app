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

// holds user styles
wss.userStyles = {};


// sends an invidiual message
wss.sendMessage = (socket, msg) => {
  socket.send(msg);
}

// tallies up users
wss.tallyUsers = (usersOnline) => {
  const message = {
    type: 'USER_TALLY',
    usersOnline
  };
  // don't need a socket here
  wss.broadcastMessage(JSON.stringify(message));
}

// Updates a user's style
wss.sendUserId = (socket, id) => {
  const message = {
    type: 'ID_ASSIGN',
    id
  }
  wss.sendMessage(socket, JSON.stringify(message));
}

// saves user to 'database'
wss.saveUser = (userId) => {
  const colors = ['#E25C60', '#3C4DE9', '#44A3DC', '#3CE9CC'];
  const userColor = colors[Math.floor(Math.random()*colors.length)];
  wss.userStyles[userId] = {color:userColor};
}

// gets a random giphy image based on a query
wss.getGiphy = (parsedMessage) => {
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
      parsedMessage.file = true;
      wss.broadcastMessage(JSON.stringify(parsedMessage));
    })
  });
}

// handles broadcasting the message.
wss.broadcastMessage = (msg) => {
  for(const client of wss.clients){
    if(client.readyState === WebSocket.OPEN){
      client.send(msg);
    }
  }
}

wss.on('connection', (socket) => {
  const userId = uuidv1();
  // sending initial information
  wss.saveUser(userId);
  wss.sendUserId(socket, userId);
  wss.tallyUsers(wss.clients.size);

  socket.on('message', (msg) => {
    const parsedMessage = JSON.parse(msg);
    // check for easter egg
    if(parsedMessage.type === 'NOTIFICATION'){
      if(parsedMessage.username === 'HULK'){
        wss.userStyles[userId] = {color:'#158202', fontSize:'3em'};
      }
    }

    if(parsedMessage.type === 'MESSAGE'){
      // assigning user styling to message
      parsedMessage.style = wss.userStyles[userId];
      const reImage = /^[\w\:\/\.\@]+\.(jpg|gif|png)$/;
      const reGiphy = /^\/giphy/;

      // check if image link sent
      if(reImage.test(parsedMessage.content)){
        parsedMessage.file = true;
      }

      // handle giphy
      if(reGiphy.test(parsedMessage.content)){
        wss.getGiphy(parsedMessage);
        return;
      }
    }
    wss.broadcastMessage(JSON.stringify(parsedMessage))
  });

  socket.on('close', () => {
    wss.tallyUsers(wss.clients.size);
    delete wss.userStyles[userId];
  })
});

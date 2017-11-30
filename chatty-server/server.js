const express = require('express');
const WebSocket = require('ws');
const uuidv1 = require('uuid/v1');
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

wss.save_user = (userId) => {
  const colors = ['blue', 'yellow', 'grey', 'tomato'];
  const userColor = colors[Math.floor(Math.random()*colors.length)];
  wss.user_styles[userId] = {color:userColor};
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
      parsedMessage.style = wss.user_styles[userId];
    }
    wss.broadcast_message(JSON.stringify(parsedMessage));
  });
  socket.on('close', () => {
    wss.tally_users(wss.clients.size);
    delete wss.user_styles[userId];
  })
});

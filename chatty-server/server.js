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
  for(const client in wss.clients){
    const curClient = wss.clients[client];
    if(curClient.readyState === WebSocket.OPEN){
      curClient.send(msg);
    }
  }
}

wss.on('connection', (socket) => {
  socket.on('message', wss.broadcast_message);
});

const express = require('express');
const WebSocket = require('ws');
const uuidv1 = require('uuid/v1');
const PORT = 8000;

const server = express()
              .use(express.static('public'))
              .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${ PORT }`));

const wss = new WebSocket.Server({ server });
const clients = {};

const broadcast_message = (msg) => {
  for(const client in clients){
    const curClient = clients[client];
    if(curClient.readyState === 1){
      curClient.send(msg);
    }
  }
}

wss.on('connection', (socket) => {
  const socketUuid = uuidv1();
  clients[socketUuid] = socket;
  socket.on('message', broadcast_message);
  // Remove clients once they've disconnected
  socket.on('close', () => {
    delete clients[socketUuid];
  });
});

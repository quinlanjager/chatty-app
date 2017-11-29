const express = require('express');
const WebSocket = require('ws');
const PORT = 8000;

const server = express()
              .use(express.static('public'))
              .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${ PORT }`));

const wss = new WebSocket.Server({ server });
const clients = [];

wss.on('connection', (socket) => {
  console.log('Client connected');+
  clients.push(socket);
  socket.on('message', (msg) => {
    for(let client of clients){
      if(client.readyState === 1){
        client.send(msg);
      }
    }
  });

  socket.on('close', () => console.log('Client disconnected'));
});

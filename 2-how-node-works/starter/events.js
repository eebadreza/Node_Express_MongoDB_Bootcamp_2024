const EventEmitter = require('events');

class Sales extends EventEmitter {
  constructor() {
    super();
  }
}

const myEmitter = new EventEmitter();

myEmitter.on('newSale', () => {
  console.log('There was a new Sale');
});

myEmitter.on('newSale', () => {
  console.log('Customer Name : Reza');
});

myEmitter.on('newSale', (stock) => {
  console.log('Amount : ', stock);
});

// myEmitter.emit('newSale', 9);

/////////////////////////////////////////////////////////////

const http = require('http');
const server = http.createServer();

server.on('request', (req, res) => {
  console.log('Request recieved!!');
  console.log(req.url);
  res.end('Request recieved!!');
});

// server.on('request', (req, res) => {
//   res.end('Another request recieved!!');
// });

server.on('close', () => {
  console.log('Server Shutdown!!');
});

server.listen(1234, '127.0.0.1', () => {
  console.log('Waiting for Requests!!');
});

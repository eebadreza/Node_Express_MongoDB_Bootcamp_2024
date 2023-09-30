const express = require('express');
const app = express();

const port = 1234;

app.get('/', (req, res) => {
  // res.status(200).send('Hello from Server!!');
  res.status(404).json({ message: 'Hello from Server!!', app: 'natours' });
});

app.post('/', (req, res) => {
  // res.status(200).send('Hello from Server!!');
  res.send('You can post here!!');
});

app.listen(port, () => {
  console.log(`Server @${port}`);
});

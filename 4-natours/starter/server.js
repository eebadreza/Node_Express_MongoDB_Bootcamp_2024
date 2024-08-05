const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const app = require('./app');

const port = process.env.PORT || 1234;
// console.log(process.env.NODE_ENV);

app.listen(port, () => {
  console.log(`Server @${port}`);
});

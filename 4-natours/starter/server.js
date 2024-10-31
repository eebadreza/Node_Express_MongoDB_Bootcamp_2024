const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const mongoose = require('mongoose');

process.on('uncaughtException', (err) => {
  console.error(err.name, err.message);
  console.log('Uncaught Exception! 💥 Shutting Down...');
  process.exit(1);
});

const app = require('./app');

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.PASSWORD);
// const DB = process.env.DATABASE_LOCAL;

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('DB connection successful');
  });

const port = process.env.PORT || 1234;
// console.log(process.env.NODE_ENV);

const server = app.listen(port, () => {
  console.log(`Server @${port}`);
});

process.on('unhandledRejection', (err) => {
  console.error(err.name, err.message);
  console.log('Unhandeled Rejection! 💥 Shutting Down...');
  server.close(() => {
    process.exit(1);
  });
});

// console.log(x);

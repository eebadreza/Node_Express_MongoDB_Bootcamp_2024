const dotenv = require('dotenv');
dotenv.config({ path: './../../config.env' });

const fs = require('fs');
const Tour = require('./../../models/tourModels');
const mongoose = require('mongoose');

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.PASSWORD);

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

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, `utf-8`)
);

// console.log(tours);

const importData = async () => {
  try {
    await Tour.create(tours);
    console.log(`Data Loaded!!`);
  } catch (err) {
    console.log(err);
  }
};

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log(`Data Cleared!!`);
  } catch (err) {
    console.log(err);
  }
};

console.log(process.argv);

if (process.argv[2] === `--import`) {
  importData();
  process.exit();
} else if (process.argv[2] === `--delete`) {
  deleteData();
  process.exit();
}

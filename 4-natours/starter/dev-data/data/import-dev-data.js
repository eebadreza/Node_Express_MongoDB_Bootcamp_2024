const dotenv = require('dotenv');
dotenv.config({ path: './../../config.env' });

const fs = require('fs');
const Tour = require('./../../models/tourModels');
const User = require('./../../models/userModels');
const Review = require('./../../models/reviewModels');
const mongoose = require('mongoose');

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8')
);

// const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.PASSWORD);
const DB = process.env.DATABASE_LOCAL;

const connectDB = async () => {
  await mongoose
    .connect(DB, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 50000, // Increase to 50 seconds
      socketTimeoutMS: 45000, // Increase socket timeout to 45 seconds
    })
    .then(() => {
      console.log('DB connection successful');
    });
};

const importData = async () => {
  try {
    await connectDB();
    await Tour.create(tours);
    await User.create(users, { validateBeforeSave: false });
    await Review.create(reviews);
    console.log('Data successfully created');
  } catch (error) {
    console.log(error);
  }

  process.exit(); // same as return in function
};

//DELETE ALL DATA FROM DATABASE

const deleteData = async () => {
  try {
    await connectDB();
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log('Data successfully deleted');
  } catch (error) {
    console.log(error);
  }
  process.exit(); // same as return in function
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}

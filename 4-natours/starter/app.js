var cors = require('cors');
const path = require('path');
const express = require('express');
const morgan = require('morgan');
const appError = require('./utils/appError');
const globalErrorHandeler = require('./controllers/errorController');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');

const tourRouter = require(`${__dirname}/routes/tourRoutes.js`);
const userRouter = require(`${__dirname}/routes/userRoutes.js`);
const reviewRouter = require(`${__dirname}/routes/reviewRoutes.js`);
const bookingRouter = require(`${__dirname}/routes/bookingRoutes.js`);
const viewRouter = require(`${__dirname}/routes/viewRoutes.js`);

const app = express();

app.use(
  cors({
    credentials: true,
    origin: true,
  })
);

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Global Middleware
// Serving Static Files
app.use(express.static(path.join(__dirname, 'public')));

// Set Security HTTP headers
// Further HELMET configuration for Security Policy (CSP)
// const scriptSrcUrls = ['https://unpkg.com/', 'https://tile.openstreetmap.org'];
// const styleSrcUrls = [
//   'https://unpkg.com/',
//   'https://tile.openstreetmap.org',
//   'https://fonts.googleapis.com/',
// ];
// const connectSrcUrls = ['https://unpkg.com', 'https://tile.openstreetmap.org'];
// const fontSrcUrls = ['fonts.googleapis.com', 'fonts.gstatic.com'];

// Development Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit Requests from same IP
const limiter = rateLimit({
  max: 1000,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in a hour!',
});

app.use('/api', limiter);

// Body parser, reading data from req.body
app.use(express.json({ limit: '10kb' }));

app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Data Sanitizaion against NoSQL query injection
app.use(mongoSanitize());

// Data Sanitizaion against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingQuantity',
      'ratingAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.cookies);
  next();
});

// Routes

app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

app.all('*', (req, res, next) => {
  next(new appError(`Can't find the ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandeler);

module.exports = app;

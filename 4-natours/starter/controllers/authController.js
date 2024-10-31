const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');
const User = require('./../models/userModels');
const catchAsync = require('./../utils/catchAsync');
const Email = require('./../utils/email');
const { url } = require('inspector');

// Synchronous sign method used ??
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true, // can't manipulate cookie any way
  };

  if (process.env.NODE_ENV === 'production') {
    cookieOptions.secure = true;
  }
  // Remove the password
  user.password = undefined;

  res.cookie('jwt', token, cookieOptions);

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
    password: req.body.password,
    passwordConfirmed: req.body.passwordConfirmed,
    passwordChangedAt: req.body.passwordChangedAt,
  });
  const url = `${req.protocol}://${req.get('host')}/me`;
  await new Email(newUser, url).sendWelocome();

  createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  // Check id email and password exist
  if (!email || !password) {
    return next(new AppError('Provide Email and Password', 400));
  }

  // Check if user exists and password is correct
  const user = await User.findOne({ email }).select('+password');
  //   console.log(user);

  // If everything is ok then send token to client
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect Email or Password', 401));
  }

  createSendToken(user, 201, res);
});

exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({ status: 'success' });
};

exports.protect = catchAsync(async (req, res, next) => {
  // Check token exists
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  // Validate the Token
  if (!token) {
    return next(new AppError('You are not logged in', 401));
  }
  // If someone changed the payload then it will throw to globalErrorHandeler
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // Check User exists
  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    const message = `The User belonging to token doesn't exist`;
    return next(new AppError(message, 401));
  }

  // Check if user changed password after JWT was issued
  if (await currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError(
        `User recently changed the password.. Please log in again`,
        401
      )
    );
  }
  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});

// Only for Rendered pages, no errors
exports.isLoggedIn = async (req, res, next) => {
  try {
    // Check token exists form cookie
    if (req.cookies.jwt) {
      // If someone changed the payload then it will throw to globalErrorHandeler
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );

      // Check User exists
      const currentUser = await User.findById(decoded.id);

      if (!currentUser) {
        return next();
      }

      // Check if user changed password after JWT was issued
      if (await currentUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }

      // Therre is a logged in user
      res.locals.user = currentUser;
      return next();
    }
  } catch (err) {
    return next();
  }

  next();
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles: ['admin', 'lead-guide']. roles: ['user']
    if (!roles.includes(req.user.role)) {
      // console.log(req.user.role);
      return next(
        new AppError(`You don't have permission to perform this operation`, 403)
      );
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new AppError('There is no user with this email', 404));
  }

  // Generate random reset token
  const resetToken = user.createPasswordResetTokens();
  await user.save({ validateBeforeSave: false });

  // Send it user email
  try {
    const resetURL = `${req.protocol}://${req.get(
      'host'
    )}/api/v1/usrs/resetPassword/${resetToken}`;

    await new Email(user, resetURL).sendPasswordReset();

    res.status(200).json({
      status: 'success',
      message: 'Token send to Mail',
    });
  } catch (err) {
    // console.log(err);

    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save({ validateBeforeSave: false });

    return next(
      new AppError('There was an error sending the mail. Try again later', 500)
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');
  // Get user based on the token
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  // If token not expired, and user exists, set new password
  if (!user) return next(new AppError('Token is Invalid or Expired', 400));

  user.password = req.body.password;
  user.passwordConfirmed = req.body.passwordConfirmed;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  // Update chaged password property for the user
  // Log the user in

  createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // Get user from collection
  const user = await User.findById(req.user.id).select('+password');
  // Check if posted current password is correct
  if (!(await user.correctPassword(req.body.currentPassword, user.password))) {
    return next(new AppError(`Your current password is wrong`, 401));
  }

  // If so, Update the Password
  user.password = req.body.password;
  user.passwordConfirmed = req.body.passwordConfirmed;
  await user.save();

  // Log user in, send JWT
  createSendToken(user, 200, res);
});

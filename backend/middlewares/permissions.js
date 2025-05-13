const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const ErrorResponse = require('../utils/ErrorResponse');

exports.protect = async (req, res, next) => {
  let token;

  // Check if authorization header exists
  if (!req.headers.authorization) {
    throw new ErrorResponse(
      401,
      'Not authorized to access this route - Missing authorization header'
    );
  }

  // Check if the format is correct (Bearer/Token + token)
  if (
    req.headers.authorization.startsWith('Bearer') ||
    req.headers.authorization.startsWith('Token')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Verify token exists
  if (!token) {
    throw new ErrorResponse(
      401,
      'Not authorized to access this route - Invalid token format'
    );
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user
    const user = await User.findById(decoded.id);

    if (!user) {
      throw new ErrorResponse(401, 'User not found with this token');
    }

    req.user = user;
    next();
  } catch (err) {
    // Handle JWT verification errors
    if (err.name === 'JsonWebTokenError') {
      throw new ErrorResponse(401, 'Invalid token');
    } else if (err.name === 'TokenExpiredError') {
      throw new ErrorResponse(401, 'Token expired');
    } else {
      throw err; // Let other errors be handled by the error handler
    }
  }
};

// const add = (num1, num2) => num1 + num2;
// const add = (...numbers) => {
//   let sum = 0;
//   for (let i = 0; i < numbers.length; i++) {
//     sum += numbers[i];
//   }
//   return sum;
// };
// add(2,4);
// add(2,4,6,10);
// console.log("hello");
// console.log("hello", "world");
// we have 2 roles as admin and user
// we can use this middleware to check if the user is admin or user
exports.authorize =
  (
    ...roles // ("admin", "user") or ("admin") or ("user")
  ) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new ErrorResponse(403, 'Not authorized to access this route');
    }
    next();
  };

// isAdminOrOwner("Post","author")
exports.isAdminOrOwner = (model, filterName) => async (req, res, next) => {
  const resource = await model.findById(req.params.id);

  if (
    req?.user.role === 'admin' ||
    resource[filterName].toString() === req?.user._id.toString()
  )
    next();
  else throw new ErrorResponse(403, 'Not authorized to access this route');
};

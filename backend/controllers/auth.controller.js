const User = require('../models/user.model');
const ErrorResponse = require('../utils/ErrorResponse');
const jwt = require('jsonwebtoken');

// @URL     POST /api/auth/register
exports.register = async (req, res) => {
  const user = await User.create(req.body);
  res.status(201).json({
    success: true,
    user,
    message: 'User created successfully',
    token: user.getToken(),
  });
};

// @URL     POST /api/auth/login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    // res.errorStatusCode = 400
    // throw new Error("Please provide email and password");
    throw new ErrorResponse(400, 'Please provide email and password');
  }

  // check the user
  const user = await User.findOne({ email }).select('+password');
  if (!user) throw new ErrorResponse(401, 'Invalid credentials'); // email is wrong
  // check the password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new ErrorResponse(401, 'Invalid credentials'); // password is wrong

  res.status(200).json({
    success: true,
    user,
    message: 'User logged in successfully',
    token: user.getToken(),
    refresh: user.getRefreshToken(),
  });
};

// @URL     ALL /api/auth/logout
exports.logout = async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Remove token from browser data',
  });
};

// @URL     PUT /api/auth/details
// @access  private (req.user)
exports.updateDetails = async (req, res) => {
  const fieldsToUpdate = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
  };

  const user = await User.findByIdAndUpdate(req.user._id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: user,
    message: 'User details updated successfully',
  });
};

// @URL     PUT /api/auth/password
// @access  private (req.user)
exports.updatePassword = async (req, res) => {
  const user = await User.findById(req.user._id).select('+password');
  // check the password
  const isMatch = await user.comparePassword(req.body.currentPassword);
  if (!isMatch) throw new ErrorResponse(401, 'Invalid credentials'); // password is wrong
  // update the password
  user.password = req.body.newPassword;
  await user.save();
  res.status(200).json({
    success: true,
    message: 'User password updated successfully',
  });
};

// URL POST     /api/auth/refresh
exports.refresh = async (req, res) => {
  const refreshToken = req.body.refreshToken;
  if (!refreshToken)
    throw new ErrorResponse(401, 'Please provide refresh token');

  jwt.verify(refreshToken, process.env.JWT_REFRESH, async (err, data) => {
    if (err) throw new ErrorResponse(401, err.message); // invalid refresh token
    const { id, password } = data;
    if (!id || !password) throw new ErrorResponse(401, 'Invalid refresh token');
    // find the user by id
    const user = await User.findById(id).select('+password');
    if (!user) throw new ErrorResponse(401, 'Invalid refresh token'); // there is no user with this id

    const isMatch = user.password === password;
    if (!isMatch) throw new ErrorResponse(401, 'Invalid refresh token'); // password is wrong

    res.send({
      success: true,
      key: user.getToken(),
      refresh: user.getRefreshToken(),
    });
  });
};

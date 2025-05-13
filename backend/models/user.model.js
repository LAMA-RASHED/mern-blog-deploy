'use strict';
/* -------------------------------------------------------
    | FULLSTACK TEAM | NODEJS / EXPRESS |
------------------------------------------------------- */
const { mongoose } = require('../config/dbConnection');
const { Schema, model } = mongoose;

const { genSalt, hash, compare } = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new Schema(
  {
    first_name: {
      type: String,
      trim: true,
      required: [true, 'First name is required'],
    },
    last_name: {
      type: String,
      trim: true,
      required: [true, 'Last name is required'],
    },
    email: {
      type: String,
      trim: true,
      required: [true, 'Email is required'],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email',
      ],
    },
    username: {
      type: String,
      trim: true,
      required: [true, 'Username is required'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      // Make password field not selectable by default
      select: false,
    },
    role: {
      type: String,
      // enum is a predefined keyword
      enum: ['admin', 'user', 'guest', 'super-admin'],
      default: 'user',
    },
  },
  { timestamps: true }
);

// Encrypt Password
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) next();

  const salt = await genSalt(10);
  this.password = await hash(this.password, salt);
  next();
});

// Compare password
UserSchema.methods.comparePassword = async function (password) {
  // compare is a function from bcrypt. It is used to compare passwords
  return await compare(password, this.password);
};

// Generate JWT Token
UserSchema.methods.getToken = function () {
  return jwt.sign(
    { id: this._id, name: this.first_name },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

// Generate JWT Refresh Token
UserSchema.methods.getRefreshToken = function () {
  return jwt.sign(
    { id: this._id, password: this.password },
    process.env.JWT_REFRESH,
    { expiresIn: process.env.JWT_REFRESH_EXPIRE }
  );
};

// Customize toJSON method to exclude password field from responses
// this is an alterntive way to exclude password field from responses
UserSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

// Query helper to exclude password field
UserSchema.query.withoutPassword = function () {
  return this.select('-password');
};

module.exports = model('User', UserSchema);

'use strict';
const mongoose = require('mongoose');

var userSchema = new mongoose.Schema( {
  user: String,
  pass: String,
  email: String,
  passHash: String,
} );

const User = mongoose.model( 'User', userSchema );

module.exports.User = User;

'use strict';
const mongoose = require('mongoose');

var userSchema = new mongoose.Schema( {
  roomId: String,
  fromUser: String,
  msg: String,
  timestamp: { type: Date, default: Date.now },
} );

const ChatMsg = mongoose.model( 'chatMsg', userSchema );

module.exports.ChatMsg = ChatMsg;

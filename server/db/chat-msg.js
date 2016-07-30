'use strict';
const mongoose = require('mongoose');

const chatMsgSchema = new mongoose.Schema( {
  roomId: String,
  fromUser: String,
  msg: String,
  timestamp: { type: Date, default: Date.now },
} );

const ChatMsg = mongoose.model( 'chatMsg', chatMsgSchema );

module.exports.ChatMsg = ChatMsg;

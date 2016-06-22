'use strict';
const mongoose = require('mongoose');

var roomSchema = new mongoose.Schema({
  name: String,
  users: [],
});

const Room = mongoose.model( 'room', roomSchema );

module.exports.Room = Room;

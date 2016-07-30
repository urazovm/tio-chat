'use strict';
const mongoose = require('mongoose');

var imageSchema = new mongoose.Schema( {
  url: String,
  sfw: Boolean,
  exists: Boolean,
} );

const ImageModel = mongoose.model( 'image', imageSchema );

module.exports.ImageModel = ImageModel;

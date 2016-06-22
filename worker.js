
var mongoose = require('mongoose');
var dbURI = process.env.MONGODB_URI || 'mongodb://localhost/urf3';
mongoose.connect(dbURI);

var db = mongoose.connection;

const User = require('./server/db/user').getUserModel(mongoose);

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log( 'Worker connected to MongoDB' );

});


//Todo: set up worker stuff?

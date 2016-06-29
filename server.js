'use strict';
var express = require('express');
var app = express();
var http = require( 'http' ).Server( app );
var io = require( 'socket.io' )( http );
var compress = require('compression')();
var path    = require("path");
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

var dbURI = process.env.MONGODB_URI || 'mongodb://localhost/urf3';

var redisUrl = process.env.REDIS_URL;

if (redisUrl) {
  const redis = require("redis");
  var adapter = require('socket.io-redis');
  let client = redis.createClient(redisUrl);
  let sub = redis.createClient( { url: redisUrl, return_buffers: true});
  io.adapter(adapter({ pubClient: client, subClient: sub }));
}
mongoose.connect(dbURI);


var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log( 'Connected to MongoDB' );
  var port = process.env.PORT  || process.argv[2] || 80;
//we're passing */model* paths through to port 1337 and serving them with node.
  http.listen( port, function() {
    console.log('ready on port: ' + port);
  } );
  setTimeout(()=> {
    io.to('/').emit('live-reload');
  },5000);
});

app.use( compress );
app.use( express.static( __dirname + '/dist' ) );

app.set( 'case sensitive routing', false );

app.get( /^\/(?!node_modules).*/, function( req, res ) {
  res.sendFile(path.join(__dirname+'/dist/index.html'));
} );

require('./server/routes/auth').createAuthRoutes(app, io, mongoose);
require('./server/routes/chat-routes').addChatRoutes(app, io);




'use strict';
const express = require('express');
const app = express();
const http = require( 'http' ).Server( app );
const io = require( 'socket.io' )( http );
const compress = require('compression')();
const path    = require("path");
const mongoose = require('mongoose');
const _ = require('lodash');
let bcrypt;
if (!process.env.noEncrypt) {
  bcrypt = require('bcrypt');
}


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
let salt;
if (!process.env.noEncrypt) {
  salt = bcrypt.genSaltSync(10);
}


var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log( 'Connected to MongoDB' );
  var port = process.env.PORT  || process.argv[2] || 80;
//we're passing */m/odel* paths through to port 1337 and serving them with node.
  http.listen( port, function() {
    console.log('ready on port: ' + port);
  } );
  setTimeout(()=> {
    io.of('/').emit('live-reload');
  },5000);

});

app.use( compress );
if (!process.env.local_host) {
  app.get('*',function(req,res,next){
    if(req.headers['x-forwarded-proto']!='https')
      res.redirect('https:/taran.io'+req.url);
    else
      next(); /* Continue to other routes if we're not redirecting */
  });
}

app.use( express.static( __dirname + '/dist' ) );

app.set( 'case sensitive routing', false );

//seems like there should be a better solution here...
app.get( /^\/(?!node_modules|image|image-test|feedCats).*/, function( req, res ) {
  res.sendFile(path.join(__dirname+'/dist/index.html'));
} );


require('./server/routes/image-proxy').setupImageProxyRoutes(app);

require('./server/routes/auth').createAuthRoutes(app, io, mongoose);
require('./server/routes/chat-routes').addChatRoutes(app, io);
require('./server/routes/image-test').setupImageRoutes(app);



var catFeedRoom = 'taran-feed-cats';

io.on( 'connection', function (socket) {
  socket.on( 'watchFeed', function() {
    socket.join( catFeedRoom );
    socket.on( 'reconnect', function() {
      socket.join( catFeedRoom );
    });
  });
});

app.get( '/feedCats', function( req, res ) {
  io.to( catFeedRoom ).emit( 'feed:cats', { feed: 'cats' } );
  res.send( 'feeding successful' );
});



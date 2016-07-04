'use strict';

const jwt = require('jsonwebtoken');
const _ = require('lodash');
const expressJwt = require('express-jwt');
const socketJwt = require('socketio-jwt');
const bcrypt = require('bcrypt');

const bb = require('bluebird');
const request = bb.promisify(require('request'));

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json({ extended: false, strict: false });
const jwtSecret = process.env.jwtSecret || 'jwt-devel';

//TODO: this should probably go!
const recaptchaKey = process.env.recaptcha_key || '';
const salt = process.env.salt_key || 'salty';

const UserModel = require('../db/user').User;

function createUser(user ) {

  return hash(user.pass)
    .then((hashPass) => {
      const newUser = new UserModel({
        user: user.user,
        passHash: hashPass
      });
      return newUser.save()
        .then(() => {
          return true;
        });
    });
}

function hash(pass) {
  return new bb((resolve, reject) => {
    bcrypt.hash(pass, salt, (err, hashedPass)=> {
      if(err) {
        console.log('hasing failed:' + err);
        reject(err);
      } else {
        resolve(hashedPass);
      }
    });
  });
}

function compare(pass, hash) {
  return new bb((resolve, reject) => {
    bcrypt.compare(pass,hash, (err, result) => {
      if(err) {
        console.log(err);
        reject(err);
      } else {
        resolve(result);
      }
    });
  })
}

function isValidUser(user) {
  //TODO: Better users one day
  if(!UserModel) {
    //for local development we only use test/test
    return bb.all([(user.user === 'test' )]);
  }
  //TODO: properly compare hashes and such
  return UserModel.find({ user: user.user}).exec()
    .then(function (docs) {
      const exists = docs && docs.length >= 1;
      if (!exists) {
        if (user.pass) {
          console.log('creating user');
          return createUser(user);
        }
        else {
          console.log('no user no pass - ok');
          return true;
        }
      } else {
        return compare(docs[0].passHash, user.pass);
      }
    })
    .catch(function (err) {
      console.log(err);
      return false;
    });
}

function createAuthRoutes(app, io) {
  //TODO should we globally use json body parser? app.use( bodyParser.json() );

  //User.remove({}, () => {console.log('data removed')}).exec();


  function authenticate(req, res, next) {
    var buffer = '';
    req.on('data', function(data) {
      buffer += data.toString();
    }).on('end', function() {
      var obj = _.isObject(buffer) ? buffer : JSON.parse(buffer);
      isValidUser(obj)
        .then(function(valid) {
          if(valid) {
            req.user = obj;
            return next();
          }
          res.status(401).end('incorrect username or password');
        })
        .catch(function(err) {
          res.status(401).end('Unknown Error.');
        });
    });
  }

  app.post('/login', authenticate, function(req, res) {
    console.log('signing: ' + req.user.user);
    var token = jwt.sign({
      user: req.user.user
    }, jwtSecret );
    res.send({
      token: token
    });
  });

  app.use(expressJwt({secret: jwtSecret}).unless({ path: [ '/login' ]}));
  app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
      res.status(401).send('invalid token...');
    }
  });

  io.sockets
    .on('connection', socketJwt.authorize({
      secret: jwtSecret,
      timeout: 1500000 // delay to send the authentication message
    })).on('authenticated', function(socket) {
    //this socket is authenticated, we are good to handle more events from it.
    //this is a fine example of terrible code with lots of duplication!

    //send available chats...


    console.log('hello! ' + socket.decoded_token.user);
    //frameowrk issues emit: socket.emit( 'authenticated' );
  });

}


module.exports.createAuthRoutes = createAuthRoutes;

'use strict';
const _  = require('lodash');
const Promise = require('bluebird');
const overwatch = require('../utils/overwatch');
const Rx = require('rx');

const scrapeBNet = overwatch.getPlayerStats;
const refreshChallengeScores = require('../db/challenge').refreshChallengeScores;

function addChallengeRoutes(app, io, mongoose) {
  const User = require('../db/user').getUserModel(mongoose);
  const Challenge = require('../db/challenge').getChallengeModel(mongoose);

  //Challenge.remove({}).then(() => { console.log('challenges removed')});

  io.on('authenticated', (socket) => {
    socket.on('challenges:add', (challenge, cb) => {
      const name = socket.decoded_token.user;
      const region = socket.decoded_token.region;
      const platform = socket.decoded_token.platform;
      Challenge.find({players: {$elemMatch: {name: name, status: {'$ne':'completed'}}}}).exec()
        .then((docs)=>{
          if(docs.length>=4) {
            return cb('Users cannot start more than 4 challenges.',null);
          }
          scrapeBNet(name.replace('#','-'), region, platform)
            .then((stats) => {
              challenge.players = [{name, start: stats, current: stats, region, platform}];
              challenge.owner = name;
              challenge.lastUpdate = Date.now();
              var chal = new Challenge(challenge);
              chal.save()
                .then( function(chal) {
                  socket.emit('challenges:add', removeHashNumberFromPlayers(chal));
                  cb('', removeHashNumberFromPlayers(chal));
                })
                .catch( function(err) {
                  cb(err, chal);
                });
            });
        });
    });

    socket.on('challenges:init', () => {
      Challenge.find({players: {$elemMatch: {name:socket.decoded_token.user}}})
        .then((docs) => {
          let challenges = [];
          _.each(docs, (challenge) => {
            challenges.push( removeHashNumberFromPlayers(challenge));
          });
          if (docs && docs.length) {
            socket.emit('challenges:init', challenges);
          }
        })
        .catch( function(err) {
          console.log(err);
        });
    });

    socket.on('challenges:join', (id, cb) => {
      Promise.all( [Challenge.find({_id: id}),
        scrapeBNet(socket.decoded_token.user.replace('#','-'), socket.decoded_token.region, socket.decoded_token.platform )])
        .then((vals) => {
          const docs = vals[0];
          const stats = vals[1];
          if (docs && docs.length) {
            const challenge = docs[0];
            if( _.find(challenge.players, {name: socket.decoded_token.user})) {
              return cb(null, removeHashNumberFromPlayers(challenge));
            }
            challenge.players.push(
              {name: socket.decoded_token.user, start: stats, current: stats, region: socket.decoded_token.region, platform: socket.decoded_token.platform}
            );

            Challenge.update({_id: challenge._id}, challenge)
              .then( () => {
                cb(null, removeHashNumberFromPlayers(challenge));
              });
          }
          else {
            cb('unknown challenge', null);
          }
        });
    });

    socket.on('challenges:refresh', (id) => {
      Challenge.find({_id: id}).exec()
        .then((docs)=>{
          if(!docs || !docs.length || docs[0].lastUpdate >= Date.now() - (1000*60*25) ||
            docs[0].status === 'completed') {
            return;
          }
          let stream = Rx.Observable.fromArray(docs);
          refreshChallengeScores(stream)
            .subscribe((challenge)=>{
                socket.emit(removeHashNumberFromPlayers(challenge));
              },
              (err)=>{console.log(err);},
              (challenge)=>{
                console.log('challenge updated');
              });
        });
    });
  });
}

function removeHashNumberFromPlayers(challenge) {
  let clone = _.cloneDeep(challenge);
  _.each(clone.players, (player)=>{
    player.name = player.name && player.name.replace(/#.*/, '');
  })
  return clone;
}
module.exports.addChallengeRoutes = addChallengeRoutes;

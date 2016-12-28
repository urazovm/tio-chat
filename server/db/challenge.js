'use strict';
const overwatch = require('../utils/overwatch');
const Rx = require('rx');

const scrapeBNet = overwatch.getPlayerStats;

var Challenge;

function getChallengeModel(mongoose) {
  if (Challenge) {
    return Challenge;
  }
  var challengeSchema = new mongoose.Schema( {
    name: String,
    start: { type: Date },
    end: { type: Date },
    createdAt: { type: Date, default: Date.now },
    owner: String,
    players: [],
    lastUpdate: Date,
    status: String,
    type: String
  } );

  Challenge = mongoose.model( 'Challenge', challengeSchema );
  return Challenge;
}

function refreshChallengeScores(challengesObservable) {
  return challengesObservable
    .flatMap((challenge)=>{
      return Rx.Observable.create((observer)=>{
        Rx.Observable.zip(Rx.Observable.fromArray(challenge.players),Rx.Observable.interval(200),(a,b)=>a)
        .flatMap((player)=> {
          const p = scrapeBNet(player.name.replace('#','-'), player.region, player.platform)
            .then((data)=>{
              player.current = data;
              return player;
            });
          return Rx.Observable.fromPromise(p);
        })
        .subscribe(
          ()=>{},
          (err)=>{console.log(err)},
          ()=>{
            observer.next(challenge);
            observer.completed();
          })
      });
    })
    .flatMap((challenge)=>{
      if ( challenge ) {
        challenge.lastUpdate = Date.now();
        return Rx.Observable.fromPromise(Challenge.update({_id: challenge._id }, challenge).then(()=>challenge));
      } else {
        return Rx.Observable.empty();
      }
    });
}

module.exports.getChallengeModel = getChallengeModel;
module.exports.refreshChallengeScores = refreshChallengeScores;

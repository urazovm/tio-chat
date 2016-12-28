'use strict';
const Rx = require('rx');
const refreshChallengeScores = require('../db/challenge').refreshChallengeScores;

function updateChallenges(mongoose) {
  const Challenge = require('../db/challenge').getChallengeModel(mongoose);

  Challenge.find({status: {'$ne': 'completed'}}).exec()
    .then( (docs) => {
      if(docs && docs.length) {
        let stream = Rx.Observable.zip(
          Rx.Observable.fromArray(docs),
          Rx.Observable.interval(2000),
          (a,b)=>a
        ).map((challenge)=>{
          challenge.status='completed';
          return challenge;
        });
        refreshChallengeScores(stream)
          .subscribe(
            (challenge)=>{
              console.log(challenge.name + ' completed');
            },
            (err)=>{console.log(err)},
            ()=>{}
          );
      }
    });
}

module.exports.updateChallenges = updateChallenges;

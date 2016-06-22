'use strict';

const schedule = require('node-schedule');
const Rx = require('rx');
const scrape = require('../utils/overwatch').getPlayerStats;
const _ = require('lodash');
const moment = require('moment');
const rankings = require('./rankings');
const challenges = require('./challenges');

const midnight = new schedule.RecurrenceRule();
midnight.hour = 2;
midnight.minute = 38;

function updateAllUsers(updateTargets, User, mongoose) {
  console.log('update task started');
  Rx.Observable.fromPromise(User.find({}).exec())
    .flatMap((docs)=>{return Rx.Observable.zip(Rx.Observable.fromArray(docs),Rx.Observable.interval(200),(a,b)=>a);})
    .flatMap((obj)=>{
      return Rx.Observable.fromPromise(
        scrape(obj.user.replace('#','-'), obj.region, obj.platform).then((data)=>{
          if(!obj.overwatchData) {
            obj.overwatchData = {};//default old data - shouldn't happen with any new data
          }
          _.each(updateTargets,(updateTarget)=>{
            obj.overwatchData[updateTarget] = data;
          });
          obj.overwatchData.current = data;
          obj.lastUpdate = Date.now();
          return obj;
        }));
    })
    .flatMap((user)=>{
      return Rx.Observable.fromPromise(User.update({_id:user._id},user).then(()=>{return user}));
    })
    .subscribe(
      (user)=>{console.log('updated' + user.user);},
      (err)=>{console.log('error: ' + err)},
      ()=>{
        console.log('completed updates');
        rankings.updateRankings(mongoose);
      }
    );
}


function setupPeriodicTasks(mongoose) {
  const User = require('../db/user').getUserModel(mongoose);
  schedule.scheduleJob(midnight, () => {
    const updateTargets = ['day'];
    const d = moment();
    if (d.day()===1) {
      updateTargets.push('week');
      challenges.updateChallenges(mongoose);
    }
    if (d.format('DD')==='01') {
      updateTargets.push('month');
    }
    setTimeout(()=>{
      updateAllUsers(updateTargets, User, mongoose);
    },1000*60);
  });
}

module.exports.setupPeriodicTasks = setupPeriodicTasks;

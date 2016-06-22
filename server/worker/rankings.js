'use strict';

const _ = require('lodash');

function scrubeValues(users) {
  _.each(users, (user) => {
    _.each(user.overwatchData.current,(champStat,champName) => {
        _.each(champStat, (category, categoryName) => {
          _.each(category, (statVal, statName)=> {
            //console.log(user.overwatchData.current[champName][categoryName][statName]);
            let strVal = user.overwatchData.current[champName][categoryName][statName].replace(',','');
            let fVal = parseFloat(strVal);
            let aryTimeVal = strVal.split(':');
            if(aryTimeVal.length > 1) {
              let timeVal = 0;
              for(var i = 0; i < aryTimeVal.length; ++i) {
                timeVal += aryTimeVal[i] * Math.pow(60, (aryTimeVal.length - 1 - i));
              }
              user.overwatchData.current[champName][categoryName][statName] = timeVal;
              return;
            }

            if (/hour/i.test(strVal)) {
              fVal *= 60;
            }
            user.overwatchData.current[champName][categoryName][statName] = fVal;
          })
        });
    });
  });
  return users;
}

function updateRankings(mongoose) {
  const User = require('../db/user').getUserModel(mongoose);
  //select all users
  console.log('updating rankings');
  User.find({}).exec()
    .then((docs) => {
      if(docs && docs.length) {
        let users = _.filter( docs, ( doc )=> {
          return doc.overwatchData && doc.overwatchData.current;
        } );
        try {
          let statsCopy = scrubeValues( _.cloneDeep( users ) );
          _.each( users, ( user ) => {
            user.overwatchData.ranking = {};
            _.each( user.overwatchData.current, ( champStat, champName ) => {
              //all, and champ keys
              user.overwatchData.ranking[ champName ] = {};
              _.each( champStat, ( category, categoryName ) => {
                user.overwatchData.ranking[ champName ][ categoryName ] = {};
                _.each( category, ( statVal, statName )=> {
                  statsCopy.sort( ( a, b )=> {
                    //sort desc, largest in front
                    let bDeath = /death/gi.test( statName );
                    let aVal = !bDeath ? 0 : 9999999;
                    let bVal = !bDeath ? 0 : 9999999;
                    if ( a.overwatchData.current && a.overwatchData.current[ champName ] &&
                      a.overwatchData.current[ champName ][ categoryName ] &&
                      a.overwatchData.current[ champName ][ categoryName ][ statName ] ) {
                      aVal = a.overwatchData.current[ champName ][ categoryName ][ statName ];
                    }
                    if ( b.overwatchData.current && b.overwatchData.current[ champName ] &&
                      b.overwatchData.current[ champName ][ categoryName ] &&
                      b.overwatchData.current[ champName ][ categoryName ][ statName ] ) {
                      bVal = b.overwatchData.current[ champName ][ categoryName ][ statName ];
                    }
                    if ( bDeath ) {
                      return aVal - bVal;
                    }
                    return bVal - aVal; //descending
                  } );
                  user.overwatchData.ranking[ champName ][ categoryName ][ statName ] = (_.findIndex( statsCopy, { user: user.user } ) + 1) +
                    '/' + statsCopy.length;
                } );

              } );
            } );

          } );
        }
        catch(e) {
          console.log(e);
        }
        _.each(users, (user)=>{
          User.update({_id: user._id}, user)
            .then(()=>{
              console.log('updated user ' + user.user);
            })
            .catch((err)=>{
              console.log(err);
            });
        });
      }
    });
}

module.exports.updateRankings = updateRankings;

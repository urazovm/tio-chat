'use strict';
const Promise = require('bluebird');
const request = Promise.promisify(require('request'));

function getChampionMap(data) {
  const characterGroupRegex = /<option value="0x02E00000FFFFFFFF">ALL HEROES<\/option>(.*?)<\/select>/gi;
  const characterRegex = /<option value="([0-9A-Fx]+)">(.*?)<\/option>/g;
  let champObj = {};
  let result;
  while(result = characterGroupRegex.exec(data)) {
    const charGroup = result[1]; //.replace(/<\/select>$/, '');
    let charResult;
    while(charResult = characterRegex.exec(charGroup)) {
      champObj[charResult[1]] = charResult[2].replace('.','');
    }
  }
  return champObj;
}

function getChampionStats(data) {
  const champMap = getChampionMap(data);
  //split champs into blocks
  const champStatGroupRegex = /data-category-id="([0-9A-Fx]+)"(.*?)data-group-id="stats"/g;
  const champStatSection = /<table class="data-table"><thead><tr><th[\sa-z0-9="]*>(.*?)<\/th><\/tr><\/thead><tbody>(.+?)<\/tbody>/gi;;
  const champStat = /<tr><td>(.*?)<\/td><td>(.*?)<\/td><\/tr>/gi;
  const champStats = {};

  let result;
  while(result = champStatGroupRegex.exec(data)) {
    let sectionResult;
    const name = champMap[result[1]+''] || 'All';
    champStats[name] = {};
    while(sectionResult = champStatSection.exec(result[2])) {
      const section = sectionResult[1];
      champStats[name][section] = {};
      let champStatResult;
      while(champStatResult = champStat.exec(sectionResult[2])) {
        const statName = champStatResult[1];
        const value = champStatResult[2];
        champStats[name][section][statName] = value;
      }
    }
  }
  return champStats;
}

function getPlayerStats(player, region, platform) {
  region = region || 'us';
  platform = platform || 'pc';
  const url = 'https://playoverwatch.com/en-us/career/' + platform + '/' + region + '/' + player;
  return request(url)
    .then((data) => {
      const body = data[1];
      return getChampionStats(body || data.body);
    });
}

//test: getPlayerStats('Zeal-1244').then((data) => console.dir(data));

module.exports.getPlayerStats = getPlayerStats;

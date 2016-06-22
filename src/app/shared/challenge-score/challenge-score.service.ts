import { Injectable } from '@angular/core';

const _ = window['_'];

@Injectable()
export class ChallengeScoreService {
  constructor() {

  }
  calculateScore(challenge) {
    switch(challenge.type) {
      case 'win':
        this.calculateWin(challenge);
        break;
      case 'E/KG':
      default:
        this.calculateKda(challenge);
        break;

    }
  }

  calculateWin(challenge) {
    _.each(challenge.players, (player) => {
      if (!player['current'] || !player['start'])
      {
        player.score = 0;
      } else {
        let wins = (parseFloat(player['current']['All']['Game']['Games Won'].replace(',','')) -
        parseFloat(player['start']['All']['Game']['Games Won'].replace(',','')));
        let games = (parseFloat(player['current']['All']['Game']['Games Played'].replace(',','')) -
        parseFloat(player['start']['All']['Game']['Games Played'].replace(',','')));;
        player.score = games > 0 ? wins / games : 0;
        player.score = Math.ceil(player.score*10000)/100;
      }
    });
  }

  calculateKda(challenge) {
    _.each(challenge.players, (player) => {
      if (!player['current'] || !player['start'])
      {
        player.score = 0;
      } else {
        let kills = (parseFloat(player['current']['All']['Combat']['Eliminations'].replace(',','')) -
        parseFloat(player['start']['All']['Combat']['Eliminations'].replace(',','')));
        let deaths = (parseFloat(player['current']['All']['Deaths']['Deaths'].replace(',','')) -
        parseFloat(player['start']['All']['Deaths']['Deaths'].replace(',','')));;
        player.score = deaths > 0 ? kills / deaths : 0;
        player.score = Math.ceil(player.score*100)/100;
      }
    });
  }
};

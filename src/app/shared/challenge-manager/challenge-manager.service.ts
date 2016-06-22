import { Injectable } from '@angular/core';
import { SocketService } from '../socket';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { ChallengeModel } from './challenge-model';

const _ = window['_'];

@Injectable()
export class ChallengeManagerService {
  public challengesObservable: Observable<ChallengeModel[]>;
  private _challengeOvservers: Observer<ChallengeModel[]>[] = [];
  private _challenges: ChallengeModel[];
  constructor(private socket: SocketService) {
    this._challenges = [];
    this.challengesObservable = new Observable((observer) => {
      if (this._challenges) {
        observer.next(this._challenges);
      }
      this._challengeOvservers.push(observer);
    });

    this.challengesObservable
      .subscribe();

    this.socket.on('authenticated', () => {
      this.socket.on('challenges:init', (challenges) => {
        this._challenges = challenges.slice();
        _.each(this._challengeOvservers, (observer) => {
          observer.next(this._challenges);
        });
      });

      this.socket.on('challenges:add', (challenge) => {
        this._challenges = [...this._challenges, challenge ];
        _.each(this._challengeOvservers, (observer) => {
          observer.next(this._challenges);
        });
      });

      this.socket.on('challenges:update', (challenge) => {
        let index = _.findIndex(this._challenges, {_id: challenge._id});
        this._challenges = [...this._challenges.slice(0, index), challenge, ...this._challenges.slice(index+1)];
        _.each(this._challengeOvservers, (observer) => {
          observer.next(this._challenges);
        });
      });

      this.socket.emit('challenges:init');
    });
  }

  getChallenges() {
    return this.challengesObservable;
  }

  create(challenge, cb) {
    this.socket.emit('challenges:add', challenge, (err,newChallenge) => {
      cb(err, newChallenge);
    });
  }

  join(id, cb) {
    this.socket.emit('challenges:join', id, (err, challenge) => {
      if(challenge) {
        this._challenges = [...this._challenges, challenge ];
        _.each(this._challengeOvservers, (observer) => {
          observer.next(this._challenges);
        });
      }
      cb(err);
    });
  }

  refresh(id) {
    this.socket.emit('challenges:refresh', id);
  }
}

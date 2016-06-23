import { Injectable } from '@angular/core';
import { SocketService } from '../socket/socket.service';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
const _ = window['_'];

@Injectable()
export class UserManagerService {
    users: {} = {};
    usersObservers = {};
    constructor(private socket: SocketService) {
        this.socket.on('user:init', (users) => {
            if(!this.users[users.roomId]) {
                this.users[users.roomId] = [];
            }
            this.users[users.roomId] = users.users || [];
            _.each(this.usersObservers[users.roomId], (obs) => {
                obs.next(this.users[users.roomId]);
            });
        });

        this.socket.on('user:join', (user) => {
            if(!this.users[user.roomId]) {
                this.users[user.roomId] = [];
            }
            console.log(this.users[user.roomId]);
            if (_.findIndex(this.users[user.roomId],(a)=>a===user.user) !== -1) {
                alert('here');
                return;
            }
            this.users[user.roomId] = [...this.users[user.roomId], user.user];
            _.each(this.usersObservers[user.roomId], (obs) => {
                obs.next(this.users[user.roomId]);
            });
        });

        this.socket.on('user:leave', (user) => {
            if(!this.users[user.roomId]) {
                this.users[user.roomId] = [];
            }
            this.users[user.roomId] = _.filter(this.users[user.roomId], (roomUser) => {
               return roomUser !== user.user;
            });

            _.each(this.usersObservers[user.roomId], (obs) => {
                obs.next(this.users[user.roomId]);
            });
        });
    }

    getUsersForRoom(room) {
        return Observable.create( (observer) => {
            this.usersObservers[room] = this.usersObservers[room] || [];
            this.usersObservers[room].push(observer);
            if (this.users[room]) {
                observer.next(this.users[room]);
            }
            return () => {
                //dispose function, remove it form the list
                this.usersObservers[room] = _.filter(this.usersObservers, (obs) => {
                    return obs !== observer;
                });
            };
        });
    }
}

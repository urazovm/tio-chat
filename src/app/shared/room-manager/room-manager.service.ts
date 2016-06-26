import { Injectable } from '@angular/core';
import { SocketService } from '../socket/socket.service';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
const _ = window['_'];

@Injectable() export class RoomManagerService {
    observers: any[] = [];
    rooms: any[] = [];
    constructor(private socket: SocketService) {
        this.socket.on('rooms:init', (rooms) => {
            this.rooms = rooms;
            _.each(this.observers, (obs) => {
                obs.next(this.rooms);
            });
        });
        this.socket.on('rooms:new', (room) => {
            if (_.findIndex(this.rooms, (r)=> {
                return r === room;
                }) === -1) {
                this.rooms = [...this.rooms,room];
            }
        });
    }

    getRooms() {
        return Observable.create( (observer) => {
            this.observers.push(observer);
            if (this.rooms && this.rooms.length) {
                _.each(this.observers, (obs) => {
                    obs.next(this.rooms);
                });
            }
            return () => {
                this.observers = _.filter(this.observers, (obs) => {
                    return obs !== observer;
                });
            };
        });
    }


}

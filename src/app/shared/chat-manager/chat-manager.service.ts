import { Injectable } from '@angular/core';
import { SocketService } from '../socket/socket.service';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
const _ = window['_'];

@Injectable()
export class ChatManagerService {
    activeRooms: any[] = [];
    rooms: any[] = [];
    roomObservers = [];
    chatObservers = {};
    chatMsgs: {} = {};
    constructor(private socket: SocketService) {
        this.socket.on('chat:init', (chat) => {
            if(!this.chatMsgs[chat.roomId]) {
                this.chatMsgs[chat.roomId] = [];
            }
            this.chatMsgs[chat.roomId] = chat.msgs || [];
            _.each(this.chatObservers[chat.roomId], (obs) => {
                obs && obs.next(this.chatMsgs[chat.roomId]);
            });
        });

        this.socket.on('chat:add', (msg) => {
            if(!this.chatMsgs[msg.roomId]) {
                this.chatMsgs[msg.roomId] = [];
            }
            this.chatMsgs[msg.roomId] = [...this.chatMsgs[msg.roomId], msg];
            _.each(this.chatObservers[msg.roomId], (obs) => {
                obs && obs.next(this.chatMsgs[msg.roomId]);
            });
        });

        this.socket.on('rooms:init', (rooms) =>{
            this.rooms = rooms;
            _.each(this.roomObservers, (obs) => {
                obs && obs.next(rooms);
            });
        });

        this.socket.on('reconnect', ()=> {
            _.each(this.activeRooms, (room) => {
                this.socket.emit('chat:join', room);
            });
        });

    }

    /*
     * @Returns: Observable<any[]> an observable of chat messages for the room;
     */
    joinRoom(room: string) {
        this.socket.emit('chat:join', room);
        this.activeRooms.push(room);

        return Observable.create( (observer) => {
            this.chatObservers[room] = this.chatObservers[room] || [];
            this.chatObservers[room].push(observer);
            if (this.chatMsgs[room]) {
               observer.next(this.chatMsgs[room]);
            }
            return () => {
                //dispose function, remove it form the list
                this.chatObservers[room] = _.filter(this.chatObservers, (obs) => {
                    return obs !== observer;
                });
            };
        });
    }

    leaveRoom(room) {
        this.activeRooms = _.filter(this.activeRooms, (activeRoom) => {
            return activeRoom !== room
        });
        this.socket.emit('chat:leave', room);
    }

  sendMessage(room, msg) {
    this.socket.emit('chat:add', {roomId: room, msg: msg});
  }

}

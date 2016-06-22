import { Injectable } from '@angular/core';
import { SocketService } from '../socket/socket.service';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
const _ = window['_'];

@Injectable()
export class ChatManagerService {
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
        });

        this.socket.on('chat:new', (msg) => {
            if(!this.chatMsgs[msg.roomId]) {
                this.chatMsgs[msg.roomId] = [];
            }
            this.chatMsgs[msg.roomId] = [...this.chatMsgs[msg.roomId], msg];

        });

        this.socket.on('rooms:init', (rooms) =>{
            this.rooms = rooms;
            _.each(this.roomObservers, (obs) => {
                obs.next(rooms);
            });
        });

    }

    /*
     * @Returns: Observable<any[]> an observable of chat messages for the room;
     */
    joinRoom(room: string) {
        this.socket.emit('chat:join', room);

        return Observable.create( (observer) => {
            this.chatObservers[room] = this.chatObservers[room] || [];
            this.chatObservers[room].push(observer);
            if (this.chatMsgs[room]) {
               observer.next(this.chatMsgs[room]);
            }
            return () => {
                //dispose function, remove it form the list
                this.chatObservers[room] = _.filter(this.roomObservers, (obs) => {
                    this.socket.emit('chat:leave', room);
                    return obs !== observer;
                });
            }
        });
    }

}

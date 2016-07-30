import { Pipe, PipeTransform } from '@angular/core';
import { CurrentUserService } from '../current-user/current-user.service';

const _ =  window['_'];
const nameSearch = /@[a-zA-Z0-9]/i;
@Pipe({name: 'chat'})
export class ChatPipe implements PipeTransform {
  constructor(private currentUser: CurrentUserService) {

  }

  transform(ary: any[]): any[] {
    let lastName = '';
    let returnAry = [];
    let currentChat = null;
    let lastTimestamp = null;
    _.each(ary, (msg) => {
      if (lastName !== msg.fromUser) {
        lastName = msg.fromUser;
        this._addChat(returnAry, currentChat);
        lastTimestamp = new Date(msg.timestamp);
        currentChat = {
          user: msg.fromUser,
          _id: msg._id,
          msgs: [],
          timestamp: new Date(msg.timestamp),
        }
      }
      let currentTimestamp = new Date(msg.timestamp)
      if (lastTimestamp.getHours() !== currentTimestamp.getHours() ||
          lastTimestamp.getMinutes() !== currentTimestamp.getMinutes()) {
        currentChat.msgs.push({type: 'date', msg: '', timestamp: currentTimestamp});
        lastTimestamp = currentTimestamp;
      }
      currentChat.msgs.push({type: 'chat', msg: msg.msg, timestamp: currentTimestamp});
    });
    if (currentChat) {
      this._addChat(returnAry, currentChat);
    }
    return returnAry;
  }
  _addChat(returnAry, currentChat) {
    if (currentChat) {
      let bMentionsMe = false;
      _.each(currentChat.msgs, (msg) =>{
        bMentionsMe = bMentionsMe || msg.msg.search('@' + this.currentUser.user) >= 0;
      });

      currentChat.mentionsMe = bMentionsMe;
      //currentChat._id += currentChat.msgs.length;
      returnAry.push(currentChat);
    }
  }
}

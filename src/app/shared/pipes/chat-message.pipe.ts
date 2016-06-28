import { Pipe, PipeTransform } from '@angular/core';

const _ =  window['_'];
const nameSearch = /@[a-zA-Z0-9]/i;
@Pipe({name: 'chat'})
export class ChatPipe implements PipeTransform {
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
      currentChat.msgs.push({type: 'chat', msg: msg.msg, timestamp: currentTimestamp, words: msg.msg.split(' ')});
    });
    if (currentChat) {
      returnAry.push(currentChat);
    }
    return returnAry;
  }
  _addChat(returnAry, currentChat) {
    if(currentChat) {
      let bMentionsMe = false;
      _.each(currentChat.msgs, (msg) =>{
        bMentionsMe = bMentionsMe || nameSearch.test(msg.msg);
      });

      currentChat.mentionsMe = bMentionsMe;
      currentChat._id += currentChat.msgs.length;
      returnAry.push(currentChat);
    }
  }
}

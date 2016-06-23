import { Pipe, PipeTransform } from '@angular/core';

const _ =  window['_'];

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
        if(currentChat) {
          returnAry.push(currentChat);
        }
        lastTimestamp = new Date(msg.timestamp);
        currentChat = {
          user: msg.fromUser,
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
      returnAry.push(currentChat);
    }
    return returnAry;
  }
}

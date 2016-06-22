import { Pipe, PipeTransform } from '@angular/core';

const _ =  window['_'];

@Pipe({name: 'chat'})
export class ChatPipe implements PipeTransform {
  transform(ary: any[]): any[] {
    let lastName = '';
    let returnAry = [];
    let currentChat = null;
    _.each(ary, (msg) => {
      if (lastName !== msg.fromUser) {
        lastName = msg.fromUser;
        if(currentChat) {
          returnAry.push(currentChat);
        }
        currentChat = {
          user: msg.fromUser,
          msgs: []
        }
      }
      currentChat.msgs.push({type: 'chat', msg: msg.msg});
    });
    if (currentChat) {
      returnAry.push(currentChat);
    }
    return returnAry;
  }
}

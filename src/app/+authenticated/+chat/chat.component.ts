import { Component, OnInit, OnDestroy } from '@angular/core';
import { Routes, Router, OnActivate, RouteSegment, RouteTree, ROUTER_DIRECTIVES } from '@angular/router';
import { MdCard } from '@angular2-material/card';
import { MdInput } from '@angular2-material/input';

import { ChatManagerService } from '../../shared/chat-manager';
import { CurrentUserService } from '../../shared/current-user';

@Component({
  moduleId: 'taranio',
  selector: 'app-chat',
  templateUrl: 'chat.component.html',
  styleUrls: ['chat.component.css'],
  directives: [ MdCard, MdInput ],
})
export class ChatComponent implements OnInit, OnActivate, OnDestroy {
  id: string;
  msgs: any[] = [];
  roomSubscription: any;
  constructor(public chatManager: ChatManagerService, public currentUser: CurrentUserService) {

  }

  ngOnInit() {
    this.roomSubscription = this.chatManager.joinRoom(this.id)
      .subscribe((msgs) => {
        console.log(msgs);
        this.msgs = msgs;
      });
  }

  ngOnDestroy() {
    if (this.roomSubscription) {
      this.roomSubscription();
    }
  }

  routerOnActivate(curr: RouteSegment, prev?: RouteSegment, currTree?: RouteTree, prevTree?: RouteTree) {
    this.id = curr.parameters['id'] || 'general';
  }

  sendMessage(target) {
    this.chatManager.sendMessage(this.id, target.value);
    target.value = null;
  }

}

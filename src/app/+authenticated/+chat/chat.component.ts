import { Component, OnInit, OnDestroy, AfterViewChecked, ElementRef, Input} from '@angular/core';
import { Routes, Router, OnActivate, RouteSegment, RouteTree, ROUTER_DIRECTIVES } from '@angular/router';
import { MdCard } from '@angular2-material/card';
import { MdInput } from '@angular2-material/input';

import { ChatManagerService } from '../../shared/chat-manager';
import { UserManagerService } from '../../shared/user-manager';
import { CurrentUserService } from '../../shared/current-user';
import { ChatPipe } from '../../shared/pipes/chat-message.pipe';
import { ChatMessage } from './shared/chat-message.component';
import { UserColorService } from '../../shared/user-color';

@Component({
  moduleId: 'taranio',
  selector: 'app-chat',
  templateUrl: 'chat.component.html',
  styleUrls: ['chat.component.css'],
  directives: [MdCard, MdInput, ChatMessage],
  pipes: [ChatPipe]
})
export class ChatComponent implements OnInit, OnActivate, OnDestroy, AfterViewChecked {
  id: string;
  msgs: any[] = [];
  users: any[] = [];
  roomSubscription: any;
  userSubscription: any;
  newMessage: boolean = false;
  elChatList: any;
  bFocus: boolean = true;
  screenFlashInterval: any = null;
  @Input() roomId: any;
  constructor(public chatManager: ChatManagerService, public currentUser: CurrentUserService,
              private userManager: UserManagerService, public element: ElementRef, public userColors: UserColorService) {

  }

  ngOnInit() {
    if(this.roomId) {
      this.id = this.roomId;
    }
    this.elChatList = this.element.nativeElement.querySelector('.chat-body');

    this.roomSubscription = this.chatManager.joinRoom(this.id)
      .subscribe((msgs) => {
        this.msgs = msgs;
        if(this.elChatList.scrollTop + this.elChatList.clientHeight >= this.elChatList.scrollHeight-10) {
          this.newMessage = true;
        }
        this._flash();
      });

    this.userSubscription = this.userManager.getUsersForRoom(this.id)
      .subscribe((users)=>{
        this.users = users;
      });
  }

  ngOnDestroy() {

    if (this.roomSubscription) {//fix cleanup later
      this.roomSubscription.unsubscribe();
      this.roomSubscription = null;
    }
    if (this.userSubscription) {//fix cleanup later
      this.userSubscription.unsubscribe();
      this.userSubscription = null;
    }
  }

  ngAfterViewChecked() {
    if(this.newMessage) {
      this.elChatList.scrollTop = this.elChatList.scrollHeight;
    }
    this.newMessage = false;
  }

  routerOnActivate(curr: RouteSegment, prev?: RouteSegment, currTree?: RouteTree, prevTree?: RouteTree) {
    if (!this.roomId) {
      this.id = curr.parameters['id'] || 'general';
    } else {
      this.id = this.roomId;
    }
  }

  sendMessage(target) {
    this.chatManager.sendMessage(this.id, target.value);
    target.value = null;
  }

  _flash() {
    if (!this.bFocus && !this.screenFlashInterval && this.msgs.length &&
      this.msgs[this.msgs.length-1].fromUser !== this.currentUser.user) {
      let bNewMessage = true;
      this.screenFlashInterval = setInterval( function() {
        if( bNewMessage ) {
          document.title = 'New Message';
        }
        else {
          document.title = 'taran.io';
        }
        bNewMessage = !bNewMessage;
      }, 1300 );
    }
  }

  blur() {
    this.bFocus = false;
  }
  focus() {
    this.bFocus = true;
    if (this.screenFlashInterval) {
      clearInterval(this.screenFlashInterval);
      document.title = 'taran.io';
      this.screenFlashInterval = null;
    }
    setTimeout(()=>{
      this.element.nativeElement.querySelector('.chat-textbox').focus();
    },50)
  }

  resized() {
    this.elChatList.scrollTop = this.elChatList.scrollHeight;
  }

  chatTracker(index, item) {
    return item && item._id;
  }

}

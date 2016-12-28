import { Component, OnInit, OnDestroy, AfterViewChecked, ElementRef, Input, ChangeDetectorRef} from '@angular/core';
import { ActivatedRoute, Params }   from '@angular/router';

import { ChatManagerService } from '../shared/chat-manager';
import { UserManagerService } from '../shared/user-manager';
import { CurrentUserService } from '../shared/current-user';
import { UserColorService } from '../shared/user-color';
import { NotificationService } from '../shared/notifications/notificaiton.service';

@Component({
  selector: 'app-chat',
  templateUrl: 'chat.component.html',
  styleUrls: ['chat.component.css'],
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewChecked {
  id: string;
  msgs: any[] = [];
  users: any[] = [];
  roomSubscription: any;
  userSubscription: any;
  shouldScroll: boolean = true;
  newMessage: boolean = false;
  elChatList: any;
  bFocus: boolean = true;
  screenFlashInterval: any = null;
  @Input() roomId: any;
  constructor(public chatManager: ChatManagerService, public currentUser: CurrentUserService,
              private userManager: UserManagerService, public element: ElementRef, public userColors: UserColorService,
              private notification: NotificationService, private ref: ChangeDetectorRef, private route: ActivatedRoute) {

  }

  ngOnInit() {
    this.route.params
      .subscribe( (params) => {
        this.id = params['id'] || 'general';
      });

    this.elChatList = this.element.nativeElement.querySelector('.chat-body');

    this.roomSubscription = this.chatManager.joinRoom(this.id)
      .subscribe((msgs) => {
        this.msgs = msgs;
        this.newMessage = true;
        this._flash();
        this.ref.detectChanges();
      });

    this.userSubscription = this.userManager.getUsersForRoom(this.id)
      .subscribe((users)=>{
        this.users = users;
        this.ref.detectChanges();
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
    if(this.shouldScroll && this.newMessage) {
      this.elChatList.scrollTop = this.elChatList.scrollHeight;
      this.newMessage = false;
    }
  }

  sendMessage(event) {
    const target = event.target;
    this.chatManager.sendMessage(this.id, target.value);
    target.value = null;
    event.preventDefault();
  }

  _flash() {
    if (!this.bFocus && this.msgs.length &&
      this.msgs[this.msgs.length-1].fromUser !== this.currentUser.user) {

      this.notification.sendNotification( this.msgs[this.msgs.length-1].fromUser,  this.msgs[this.msgs.length-1].msg);
      if (!this.screenFlashInterval) {
        let bNewMessage = true;
        this.screenFlashInterval = setInterval( () => {
          if( bNewMessage ) {
            document.title = 'New Message';
          }
          else {
            document.title = 'taran.io';
          }
          bNewMessage = !bNewMessage
        }, 1300 );
      }
    }
  }

  scrolled() {
    this.shouldScroll = this.elChatList.scrollTop + this.elChatList.clientHeight >= this.elChatList.scrollHeight-10
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
    },50);
  }

  childRendered(params) {
    this.elChatList.scrollTop = this.elChatList.scrollHeight;
  }

  resized() {
    this.elChatList.scrollTop = this.elChatList.scrollHeight;
  }

  chatTracker(index, item) {
    return item && item._id;
  }

}

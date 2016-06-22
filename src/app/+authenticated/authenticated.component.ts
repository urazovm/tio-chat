import { Component, OnInit } from '@angular/core';
import { Routes, Router, OnActivate, RouteSegment, RouteTree, ROUTER_DIRECTIVES } from '@angular/router';
import { ChatComponent } from './+chat';
import { ProfileComponent } from './+profile';
import { CurrentUserService } from '../shared/current-user/current-user.service';
import { SocketService } from '../shared/socket/socket.service';
import { NewChatComponent } from './+new-chat';

let authenticatedJwt = '';

@Component({
  moduleId: 'taranio',
  selector: 'app-authenticated',
  templateUrl: 'authenticated.component.html',
  styleUrls: ['authenticated.component.css'],
  directives: [ROUTER_DIRECTIVES]
})
@Routes([
  {path: '/chat/:id', component: ChatComponent},
  {path: '/new', component: NewChatComponent},
  {path: '/profile', component: ProfileComponent},
  {path: '/', component: ChatComponent},
  {path: '/chat', component: ChatComponent},

])
export class AuthenticatedComponent implements OnInit, OnActivate {
  constructor(public currentUser: CurrentUserService, private router: Router, private socket: SocketService) {}

  ngOnInit() {
  }


  routerOnActivate(curr: RouteSegment, prev?: RouteSegment, currTree?: RouteTree, prevTree?: RouteTree) {
    if(!this.currentUser.user || !this.currentUser.jwt) {
      //save the too route to auto navigate to it after logging in?
      this.currentUser.originalDestination = location.pathname;
      this.router.navigate(['/login']);
    } else {
      if(authenticatedJwt !== this.currentUser.jwt) {
        authenticatedJwt = this.currentUser.jwt;
        this.socket.emit('authenticate', {token: this.currentUser.jwt});
        this.socket.on('reconnect', () => {
          this.socket.emit('authenticate', {
            token: this.currentUser.jwt,
          });
        });
      }
    }
  }
}

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CurrentUserService } from './shared/current-user/current-user.service';
import { RoomManagerService } from './shared/room-manager/room-manager.service';
import { MdListItem } from '@angular/material/list';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  chatRooms: any[] = [];
  constructor(private router: Router, public currentUser: CurrentUserService, public roomManager: RoomManagerService) {
    this.roomManager.getRooms()
      .subscribe( (rooms) => {
        this.chatRooms = rooms;
      });
  }

  public navigate(newRoute) {
    this.router.navigate([newRoute]);
  }

  public logout() {
    this.currentUser.logout();
    this.router.navigate(['login']);
  }
}

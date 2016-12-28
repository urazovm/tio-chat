import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { CurrentUserService } from '../current-user/current-user.service';

@Injectable()
export class LoginAuthGuard implements CanActivate {
  constructor(private currentUser: CurrentUserService) {}

  canActivate() {
    return this.currentUser.isLoggedIn();
  }
}

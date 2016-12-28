import { Injectable } from '@angular/core';
import { SocketService } from '../socket/socket.service';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { Router } from '@angular/router'

const _ = window['_'];

@Injectable()
export class CurrentUserService {
  loggedIn: boolean = false;
  jwt: string;
  user: string;
  overwatchData: any;
  originalDestination: string;
  private _overwatchDataOvservers: Observer<any[]>[] = [];
  public overwatchDatasObservable: Observable<any>;

  constructor(private socket: SocketService, private router: Router) {
    this.user = window.localStorage.getItem('user');
    if (/-/.test(this.user)) {
     this.user = null;
    }
    else {
      this.jwt = window.localStorage.getItem('jwt');
    }

    this.overwatchDatasObservable = new Observable((observer) => {
      if (this.overwatchData) {
        observer.next(this.overwatchData);
      }
      this._overwatchDataOvservers.push(observer);
    });

    this.socket.on('user:overwatchData', (data) => {
      this.overwatchData = data;
      _.each(this._overwatchDataOvservers, (observer) => {
        observer.next(data);
      });
    });
  }

  login(user, jwt) {
    this.user = user;
    this.jwt = jwt;
    window.localStorage.setItem('user', user);
    window.localStorage.setItem('jwt', jwt);
  }

  logout() {
    window.localStorage.removeItem('user');
    window.localStorage.removeItem('jwt');
    this.user = null;
    this.jwt = null;
  }

  isLoggedIn() {
    console.log('here');
    if(!this.jwt) {
      this.router.navigate(['/login']);
      return false;
    }
    if(!this.loggedIn) {
      this.socket.emit('authenticate', {token: this.jwt});
      this.socket.on('reconnect', () => {
        this.socket.emit('authenticate', {
          token: this.jwt,
        });
      });
      this.loggedIn = true;
    }

    return true;

  }

  getOverwatchData() {
    return this.overwatchDatasObservable;
  }

}

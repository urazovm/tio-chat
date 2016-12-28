import { Component, OnInit } from '@angular/core';
import { MdInputContainer } from '@angular/material/input/input-container';
import { CurrentUserService } from '../shared/current-user/current-user.service';
import { Http, Response } from '@angular/http';
import {Router} from '@angular/router';
import { MdRadioButton, MdRadioGroup } from '@angular/material/radio/radio';
import { MdCard } from '@angular/material/card/card';

@Component({
  moduleId: 'taranio',
  selector: 'app-login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.css'],
})
export class LoginComponent implements OnInit {
  loggingIn: boolean = false;
  username: string;
  password: string;
  error: string;
  constructor(public currentUser: CurrentUserService, private http: Http, private router: Router)  {}

  ngOnInit() {
  }

  setUsername(user) {
    this.username = user;
  }

  setPassword(pass) {
    this.password = pass;
  }

  login(form) {
    this.loggingIn = true;

    const postBody = {user: this.username, pass: this.password};

    return this.http.post('login', JSON.stringify(postBody))
      .map((resp: Response) => { return resp.json() || {} })
      .subscribe((data) => {
          let newState =  this.currentUser.originalDestination || 'a/chat';
          this.currentUser.login(this.username, data.token);
          this.router.navigate([newState]);
        },
        (err) => {
          this.loggingIn = false;
          console.log(err);
          this.error = err._body;
        });

  }

}

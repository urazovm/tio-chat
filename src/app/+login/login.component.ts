import { Component, OnInit } from '@angular/core';
import { MdInput } from '@angular2-material/input';
import { CurrentUserService } from '../shared/current-user/current-user.service';
import { Http, Response } from '@angular/http';
import {Router} from '@angular/router';
import { MdRadioButton, MdRadioGroup } from '@angular2-material/radio';
import { MdCard } from '@angular2-material/card';

@Component({
  moduleId: 'taranio',
  selector: 'app-login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.css'],
  directives: [ MdInput, MdRadioButton, MdRadioGroup, MdCard ],
})
export class LoginComponent implements OnInit {
  loggingIn: boolean = false;
  error: string;
  constructor(public currentUser: CurrentUserService, private http: Http, private router: Router)  {}

  ngOnInit() {
  }

  login(form) {
    this.loggingIn = true;
    const user = form.form.controls.username.value;
    const pass = form.form.controls.password.value;

    const postBody = {user, pass};

    return this.http.post('login', JSON.stringify(postBody))
      .map((resp: Response) => { return resp.json() || {} })
      .subscribe((data) => {
          let newState =  this.currentUser.originalDestination || 'a/chat';
          this.currentUser.login(user, data.token);
          this.router.navigate([newState]);
      },
        (err) => {
          this.loggingIn = false;
            console.log(err);
          this.error = err._body;
        });

  }

}

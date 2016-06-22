import { Component } from '@angular/core';
import {MdToolbar} from '@angular2-material/toolbar';
import {MdIcon, MdIconRegistry} from '@angular2-material/icon';
import {MdButton} from '@angular2-material/button/button';
import {MD_SIDENAV_DIRECTIVES} from '@angular2-material/sidenav/sidenav';
import {MD_LIST_DIRECTIVES} from '@angular2-material/list/list';
import {Routes, Router, ROUTER_DIRECTIVES} from '@angular/router';
import { AuthenticatedComponent } from './+authenticated';
import { LoginComponent } from './+login';
import { CurrentUserService } from './shared/current-user/current-user.service';
import { SocketService } from './shared/socket/socket.service';
import { ChallengeManagerService } from './shared/challenge-manager/challenge-manager.service';
import { MdRadioDispatcher } from '@angular2-material/radio';
import { ChallengeScoreService } from './shared/challenge-score/challenge-score.service';
//import { ProfileComponent } from './+authenticated/+profile/profile.component';

const _ = window['_'];

@Component({
  moduleId: 'taranio',
  selector: 'spoonado-app',
  templateUrl: 'spoonado.component.html',
  styleUrls: ['spoonado.component.css'],
  directives: [ROUTER_DIRECTIVES, MdToolbar, MdIcon, MdButton, MD_SIDENAV_DIRECTIVES, MD_LIST_DIRECTIVES],
  providers: [MdIconRegistry, MdRadioDispatcher, CurrentUserService, SocketService, ChallengeManagerService,
    ChallengeScoreService],
})
@Routes([
  {path: '/a', component: AuthenticatedComponent},
  {path: '/login', component: LoginComponent},
  {path: '/', component: AuthenticatedComponent},
  {path: '/**', component: AuthenticatedComponent},
])
export class SpoonadoAppComponent {
  chatRooms: any[] = [];
  constructor(private router: Router, public currentUser: CurrentUserService,
              private challengeManager: ChallengeManagerService) {
   /* this.challengeManager.getChallenges()
      .subscribe((challenges) => {
        this.challenges = _.filter(challenges, (chal)=>{return chal.status !== 'completed';});
        this.finished = _.filter(challenges, (chal)=>{return chal.status === 'completed';});
      });*/
  }

  public navigate(newRoute) {
    this.router.navigate([newRoute]);
  }

  public logout() {
    this.currentUser.logout();
    this.router.navigate(['login']);
  }
}

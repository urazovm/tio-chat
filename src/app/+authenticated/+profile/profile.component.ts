import { Component, OnInit } from '@angular/core';
import { CurrentUserService } from '../../shared/current-user/current-user.service';
import { MD_TABS_DIRECTIVES } from '@angular2-material/tabs';
import { MdCard } from '@angular2-material/card';
import { ValuesPipe } from '../../shared/pipes/values.pipe';
import { SortPipe } from '../../shared/pipes/sort.pipe';

const _ = window['_'];

@Component({
  moduleId: 'taranio',
  selector: 'profile',
  templateUrl: 'profile.component.html',
  styleUrls: ['profile.component.css'],
  directives: [MD_TABS_DIRECTIVES, MdCard],
  pipes: [ValuesPipe,SortPipe],
})
export class ProfileComponent {
  constructor(public currentUser: CurrentUserService) {

  }

}

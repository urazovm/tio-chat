import { Component, OnInit } from '@angular/core';
import { ChatComponent } from '../+chat/chat.component';
import { MdCard } from '@angular2-material/card';

@Component({
  moduleId: 'taranio',
  selector: 'trip',
  templateUrl: 'trip.component.html',
  styleUrls: ['trip.component.css'],
  directives: [ChatComponent,MdCard],
})
export class TripComponent {
  constructor() {

  }
}

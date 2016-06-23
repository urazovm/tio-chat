import { Component, Input } from '@angular/core';

@Component({
    moduleId: 'taranio',
    selector: 'message',
    templateUrl: 'chat-message.component.html',
    styleUrls: ['chat-message.component.css'],
})
export class ChatMessage {
    @Input() msg;
    constructor() {

    }

    ngOnInit() {
        console.log(this.msg);
    }
}
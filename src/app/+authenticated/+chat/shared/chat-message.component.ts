import { Component, Input } from '@angular/core';
import { CurrentUserService } from '../../../shared/current-user';

const userRegex = /^@[a-zA-Z0-9]+$/i;


@Component({
    moduleId: 'taranio',
    selector: 'message',
    templateUrl: 'chat-message.component.html',
    styleUrls: ['chat-message.component.css'],
})
export class ChatMessage {
    @Input() msg;
    constructor(private currentUser: CurrentUserService) {

    }

    ngOnInit() {

    }

    getColor(word) {
        if (word.search(this.currentUser.user) !== -1) {
            return 'blue';
        }
        return 'black';
    }
}

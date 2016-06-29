import { Component, Input } from '@angular/core';
import { CurrentUserService } from '../../../shared/current-user';
import { UserColorService } from '../../../shared/user-color';

const userRegex = /^@([a-zA-Z0-9]+)[\.\?,!]*$/i;


@Component({
    moduleId: 'taranio',
    selector: 'message',
    templateUrl: 'chat-message.component.html',
    styleUrls: ['chat-message.component.css'],
})
export class ChatMessage {
    @Input() msg;
    constructor(private currentUser: CurrentUserService, public userColors: UserColorService) {

    }

    ngOnInit() {

    }

    getColor(word) {
        let result = userRegex.exec(word);
        if (result) {
            return this.userColors.getColorForUser(result[1]);
        }
        return 'black';
    }
}

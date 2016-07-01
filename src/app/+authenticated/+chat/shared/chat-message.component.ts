import { Component, Input } from '@angular/core';
import {CORE_DIRECTIVES} from '@angular/common';
import { CurrentUserService } from '../../../shared/current-user';
import { UserColorService } from '../../../shared/user-color';

const userRegex = /^@([a-zA-Z0-9]+)[\.\?,!]*$/i;
const linkRegex = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/i;


@Component({
    moduleId: 'taranio',
    selector: 'message',
    templateUrl: 'chat-message.component.html',
    styleUrls: ['chat-message.component.css'],
    directives: [CORE_DIRECTIVES],
})
export class ChatMessage {
    @Input() msg;
    constructor(private currentUser: CurrentUserService, public userColors: UserColorService) {

    }

    ngOnInit() {

    }

    getWordType(word) {
        if (userRegex.test(word)) {
            return 'user';
        } else if (linkRegex.test(word)) {
            return 'link';
        }
        return 'default';
    }

    getLinkHref(word) {
        let result = linkRegex.exec(word);
        let link = result[0];
        if(/^http/.test(link)) {
            return link;
        }
        return 'http://' + link;
    }

    getColor(word) {
        let result = userRegex.exec(word);
        if (result) {
            return this.userColors.getColorForUser(result[1]);
        }
        return '#5c5c5c';
    }
}

import { Component, Input } from '@angular/core';
import {CORE_DIRECTIVES} from '@angular/common';
import { CurrentUserService } from '../../../shared/current-user';
import { UserColorService } from '../../../shared/user-color';

//const userRegex = /^@([a-zA-Z0-9]+)[\.\?,!]*$/i;
const userRegex = /(^|\s)(@[a-zA-Z0-9]+)/i;
const linkRegex =  /([-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?)/;
//const linkRegex = /(http(s)?:\/\/)?(www)?[a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}([-a-zA-Z0-9\/@:%_\+.~#;?&//=]*)?!:/gi;
const codeRegex = /<code>([^<\/code>]*)<\/code>/i;


@Component({
    moduleId: 'taranio',
    selector: 'message',
    templateUrl: 'chat-message.component.html',
    styleUrls: ['chat-message.component.css'],
    directives: [CORE_DIRECTIVES],
})
export class ChatMessage {
    @Input() msg;
    words: any[] = [];
    constructor(private currentUser: CurrentUserService, public userColors: UserColorService) {

    }

    ngOnInit() {
        this.words = this._parseMessage();
    }

    _parseMessage() {
        let parsedWords = [{span: this.msg.msg, type: 'any'}];
        parsedWords = this._parseWords(parsedWords, codeRegex, 'code');
        parsedWords = this._parseWords(parsedWords, userRegex, 'user');
        parsedWords = this._parseWords(parsedWords, linkRegex, 'link');
        return parsedWords;
    }



    _parseWords(words, regex, msgType) {
        let parsedWords = [];
        _.each(words, (word)=> {
            if (word.type!=='any') {
                parsedWords.push(word);
                return;
            }
            let splits = word.span.split(regex, 1);
            while (true) {
                parsedWords.push({ span: splits[0], type: 'any' });
                if (splits.length === 1) {
                    break;
                }
                parsedWords.push({ span: splits[1], type: msgType });

                if(splits.length > 2) {
                    splits = splits[2].split(codeRegex, 1);
                } else {
                    break;
                }
            }
        });

        return parsedWords;
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

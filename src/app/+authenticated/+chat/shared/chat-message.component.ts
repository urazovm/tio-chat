import { Component, Input } from '@angular/core';
import {CORE_DIRECTIVES} from '@angular/common';
import { CurrentUserService } from '../../../shared/current-user';
import { UserColorService } from '../../../shared/user-color';
import { CodeEditorComponent } from '../../../shared/code-editor/code-editor.component';


//const userRegex = /^@([a-zA-Z0-9]+)[\.\?,!]*$/i;
const userRegex = /((?:^|\s)@[a-zA-Z0-9]+)/;
const linkRegex =  /([-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(?:\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?)/;
//const linkRegex = /(http(s)?:\/\/)?(www)?[a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}([-a-zA-Z0-9\/@:%_\+.~#;?&//=]*)?!:/gi;
const codeRegex = /<code>((?:.|\n)*)<\/code>/i;

declare var _: any;


@Component({
    moduleId: 'taranio',
    selector: 'message',
    templateUrl: 'chat-message.component.html',
    styleUrls: ['chat-message.component.css'],
    directives: [CORE_DIRECTIVES, CodeEditorComponent],
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
        let parsedWords = [{span: this.msg.msg.replace(/\n$/, ''), type: 'any'}];
        parsedWords = this._parseWords(parsedWords, codeRegex, 'code');
        parsedWords = this._parseWords(parsedWords, userRegex, 'user');
        parsedWords = this._parseWords(parsedWords, linkRegex, 'link');
        parsedWords = this._parseWords(parsedWords, /(\n)/, 'newline');
        return parsedWords;
    }



    _parseWords(words, regex, msgType) {
        let parsedWords = [];
        _.each(words, (word)=> {
            if (word.type !== 'any') {
                parsedWords.push(word);
                return;
            }
            let splits = word.span.split(regex);
            _.each(splits, (split, index)=> {
              parsedWords.push( {
                span: split,
                type: index % 2 === 0 ? 'any' : msgType,
              })
            });
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
        let link = word;
        if(/^http/.test(link)) {
            return link;
        }
        return 'http://' + link;
    }

    getColor(word) {
      return this.userColors.getColorForUser(word.trim().substring(1));
    }

  msgTracker(index, item) {
    return item && item.span;
  }
}

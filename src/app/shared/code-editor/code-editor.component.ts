import { Component, OnInit, ElementRef, Renderer } from '@angular/core';

declare var CodeMirror: any;

@Component({
    moduleId: 'taranio',
    selector: 'code-editor',
    templateUrl: 'code-editor.component.html',
    styleUrls: ['code-editor.component.css'],
})
export class AuthenticatedComponent implements OnInit {
    editor: any;
    constructor(public element: ElementRef, public renderer: Renderer){

    }

    ngOnInit() {
        this.editor = new CodeMirror.fromTextArea(
            this.element.nativeElement.querySelector('#code-textarea'), {lineNumbers: true, mode: {name: "javascript", globalVars: true}});
    }
}

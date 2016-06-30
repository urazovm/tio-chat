import {Component, ElementRef, Renderer} from '@angular/core'

declare var CodeMirror: any;

@Component({
    moduleId:'taranio',
    selector: '[editor]',
    templateUrl: 'editor.component.html',
    styleUrls: ['editor.component.css'],
})

export class EditorComponent {
    editor: any;
    constructor(public element: ElementRef, public renderer: Renderer){
        this.editor = new CodeMirror.fromTextArea(element.nativeElement, {lineNumbers: true, mode: {name: "javascript", globalVars: true}});
    }
}
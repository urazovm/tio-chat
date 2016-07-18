import { Component, OnInit, ElementRef, Renderer, Input } from '@angular/core';

declare var CodeMirror: any;

@Component({
    moduleId: 'taranio',
    selector: 'code-editor',
    templateUrl: 'code-editor.component.html',
    styleUrls: ['code-editor.component.css'],
})
export class CodeEditorComponent implements OnInit {
  editor: any;
  @Input() code;
  constructor(public element: ElementRef, public renderer: Renderer){

  }

  ngOnInit() {
    this.editor = new CodeMirror.fromTextArea(
      this.element.nativeElement.querySelector('#code-textarea'),
      {
        lineNumbers: true,
        readOnly: true,
        mode: {name: "javascript", globalVars: true},
        width: '100%',
        minHeight: 0,
        viewportMargin: Infinity,
        textWrapping: true,
      });
    this.editor.getDoc().setValue(this.code.trim());
  }
}

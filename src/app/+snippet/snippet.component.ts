import {Component} from '@angular/core'
import { Routes, Router, OnActivate, RouteSegment, RouteTree, ROUTER_DIRECTIVES } from '@angular/router';
import {EditorComponent} from './shared/editor.component'

@Component({
    selector: 'editor',
    templateUrl: `<editor (value)="id"></editor>`,
    directives: [EditorComponent]
})


export class SnippetComponent implements OnActivate {
    id: string;
    constructor(){}

    routerOnActivate(curr: RouteSegment, prev?: RouteSegment, currTree?: RouteTree, prevTree?: RouteTree) {
        this.id = curr.parameters['id'] || 'general';
    }
}
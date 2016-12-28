import { NgModule } from '@angular/core';

import { ChatRoutingModule } from './chat.routes';

import { ChatMessage } from './shared/chat-message.component';

import { ChatComponent }   from './chat.component';
import { MaterialModule } from '@angular/material';
import { CommonModule } from '@angular/common';
import { ChatPipe } from '../shared/pipes/chat-message.pipe';
import { CodeEditorComponent } from '../shared/code-editor/code-editor.component';
import { PreviewComponent } from './shared/preview/preview.component';
import { SafeHtml } from '../shared/safe-html/safe-html.pipe';


@NgModule({
  imports: [
    ChatRoutingModule,
    MaterialModule.forRoot(),
    CommonModule
  ],
  exports: [],
  declarations: [ChatComponent, ChatMessage, ChatPipe, CodeEditorComponent, PreviewComponent, SafeHtml],
  providers: [],
})
export class ChatModule { }

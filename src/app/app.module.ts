import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, Http } from '@angular/http';
import { AppRoutingModule } from './app.routes';
import { AuthHttp, AuthConfig } from 'angular2-jwt';
import { MaterialModule } from '@angular/material';
import 'hammerjs';
import { CommonModule } from '@angular/common';

import { AppComponent } from './app.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

import { ChatManagerService } from './shared/chat-manager';
import { UserManagerService } from './shared/user-manager';
import { UserColorService } from './shared/user-color';
import { CurrentUserService } from './shared/current-user/current-user.service';
import { SocketService } from './shared/socket/socket.service';
import { RoomManagerService } from './shared/room-manager/room-manager.service'

import { OptionsService } from './shared/options/options.service';
import { NotificationService } from './shared/notifications/notificaiton.service';
import { LoginAuthGuard } from './shared/auth/auth.service';
import { SafeHtml } from './shared/safe-html/safe-html.pipe';

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    FormsModule,
    HttpModule,
    CommonModule,
    MaterialModule.forRoot()
  ],
  providers: [
    {
      provide: AuthHttp,
      useFactory: (http) => {
        return new AuthHttp(new AuthConfig({
          tokenName: 'jwt',
        }), http);
      },
      deps: [Http]
    },
    SocketService, CurrentUserService, ChatManagerService, SafeHtml,
    UserManagerService, RoomManagerService, UserColorService, OptionsService, NotificationService, LoginAuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

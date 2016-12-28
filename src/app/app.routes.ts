import { AppComponent } from './app.component';
import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';
import {PageNotFoundComponent} from "./page-not-found/page-not-found.component";
import { LoginAuthGuard } from './shared/auth/auth.service'

const routes: Routes = [
    { path: '', redirectTo: '/chat', pathMatch: 'full' },
    { path: 'home', loadChildren: './+home/home.module#HomeModule' },
    { path: 'login', loadChildren: './+login/login.module#LoginModule'},
    { path: 'chat', loadChildren: './+chat/chat.module#ChatModule', canActivate: [LoginAuthGuard] },
    { path: 'a/chat', loadChildren: './+chat/chat.module#ChatModule', canActivate: [LoginAuthGuard] },
    { path: '**', component: PageNotFoundComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule { }

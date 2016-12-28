import { NgModule } from '@angular/core';

import { LoginRoutingModule } from './login.routes';

import { LoginComponent }   from './login.component';

@NgModule({
    imports: [
        LoginRoutingModule
    ],
    exports: [],
    declarations: [LoginComponent],
    providers: [],
})
export class LoginModule { }
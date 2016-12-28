import { NgModule } from '@angular/core';

import { LoginRoutingModule } from './login.routes';

import { LoginComponent }   from './login.component';
import { MaterialModule } from '@angular/material';
import { CommonModule } from '@angular/common';

@NgModule({
    imports: [
       LoginRoutingModule,
       MaterialModule.forRoot(),
       CommonModule
    ],
    exports: [],
    declarations: [LoginComponent],
    providers: [],
})
export class LoginModule { }

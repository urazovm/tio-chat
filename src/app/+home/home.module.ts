import { NgModule } from '@angular/core';

import { HomeRoutingModule } from './home.routes';

import { HomeComponent }   from './home.component';

@NgModule({
    imports: [
        HomeRoutingModule
    ],
    exports: [],
    declarations: [HomeComponent],
    providers: [],
})
export class HomeModule { }

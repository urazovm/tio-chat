import { NgModule } from '@angular/core';

import { ProfileRoutingModule } from './profile.routes';

import { ProfileComponent }   from './profile.component';

@NgModule({
    imports: [
        ProfileRoutingModule
    ],
    exports: [],
    declarations: [ProfileComponent],
    providers: [],
})
export class ProfileModule { }

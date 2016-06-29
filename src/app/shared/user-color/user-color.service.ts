import { Injectable } from '@angular/core';

@Injectable()
export class UserColorService {
    colorMap: {} = {};
    colors: any[] = ['blue', 'red','darkgreen'];
    nextColor = 0;
    constructor() {

    }

    getColorForUser(user) {
        if (!this.colorMap[user]) {
            this.colorMap[user] = this.colors[this.nextColor];
            if (++this.nextColor === this.colors.length) {
               this.nextColor = 0;
            }
        }
        return this.colorMap[user];
    }
}

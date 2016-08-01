import { Injectable } from '@angular/core';

@Injectable()
export class OptionsService {
    showImagePreviews: boolean = false;
    constructor() {
        this.showImagePreviews = (window.localStorage.getItem('imagePreviews') !== 'n' ? true : false);
    }

    setImagePreviews(param) {
        this.showImagePreviews = param;
        let storageParam = (param ? 'y' : 'n');
        window.localStorage.setItem('imagePreviews', storageParam);
    }
}
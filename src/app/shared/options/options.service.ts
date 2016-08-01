import { Injectable } from '@angular/core';

@Injectable()
export class OptionsService {
    showImagePreviews: boolean = false;
    constructor() {
        this.showImagePreviews = (window.localStorage.getItem('imagePreviews') === "1" ? true : false);
    }

    setImagePreviews(param) {
        this.showImagePreviews = param;
        let storageParam = (param ? '1' : '0');
        window.localStorage.setItem('imagePreviews', storageParam);
    }
}
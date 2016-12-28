import { Injectable } from '@angular/core';

declare var Notification: any;

@Injectable()
export class NotificationService {
    constructor() {
        if (window['Notification'] && Notification.permission !== 'granted' &&
            Notification.permission !== 'denied' ) {
            Notification.requestPermission();
        }
    }

    sendNotification(text, title='taran.io') {
        if (window['Notification'] && Notification.permission === 'granted') {
            let n = new Notification(title, {body: text});
            n.onclick= ()=>{
                n.close();
                window.focus();
            };
            setTimeout(n.close.bind(n), 4000);
        }
    }
}

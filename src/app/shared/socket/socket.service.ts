import { Injectable, NgZone } from '@angular/core';

@Injectable()
export class SocketService {
  private socket:any;
  constructor(private _ngZone: NgZone) {
    this.socket = window["io"].connect();
  }

  public emit(event: string, params?: any, cb?: any) {
    this.socket.emit(event, params, cb);
  }

  public on(event: string, fn: any) {
    this.socket.on(event, (data) => {
      this._ngZone.run( () => {
        try {
          fn(data);
        }
        catch(e) {
          console.error(e);
        }
      })
    })
  }
}

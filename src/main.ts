import { bootstrap } from '@angular/platform-browser-dynamic';
import { enableProdMode, provide } from '@angular/core';
import { SpoonadoAppComponent } from './app/spoonado.component';
import { HTTP_PROVIDERS, Http } from '@angular/http';
import { ROUTER_PROVIDERS } from '@angular/router';
import {AUTH_PROVIDERS, AuthConfig, AuthHttp} from 'angular2-jwt';

enableProdMode();

bootstrap(SpoonadoAppComponent, [
  HTTP_PROVIDERS,
  ROUTER_PROVIDERS,
  provide(AuthHttp, {
    useFactory: (http) => {
      return new AuthHttp(new AuthConfig({
        tokenName: 'jwt',
      }), http);
    },
    deps: [Http]
  })
]);

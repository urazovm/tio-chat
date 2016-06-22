import { bootstrap } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { SpoonadoAppComponent } from './app/spoonado.component';
import { HTTP_PROVIDERS } from '@angular/http';
import { ROUTER_PROVIDERS } from '@angular/router';
import {AUTH_PROVIDERS} from 'angular2-jwt';

enableProdMode();

bootstrap(SpoonadoAppComponent, [
  HTTP_PROVIDERS,
  ROUTER_PROVIDERS,
  AUTH_PROVIDERS,
]);

/// <reference path="../typings/globals/node/index.d.ts" />
/// <reference path="../typings/globals/es6-shim/index.d.ts" />

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { AppModule } from './app/app.module';

enableProdMode();


platformBrowserDynamic().bootstrapModule(AppModule);

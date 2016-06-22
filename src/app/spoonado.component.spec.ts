import {
  beforeEachProviders,
  describe,
  expect,
  it,
  inject
} from '@angular/core/testing';
import { SpoonadoAppComponent } from '../app/spoonado.component';

beforeEachProviders(() => [SpoonadoAppComponent]);

describe('App: Spoonado', () => {
  it('should create the app',
      inject([SpoonadoAppComponent], (app: SpoonadoAppComponent) => {
    expect(app).toBeTruthy();
  }));
});

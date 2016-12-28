/*
import {
  beforeEachProviders,
  it,
  describe,
  expect,
  inject
} from '@angular/core/testing';
import { CurrentUserService } from './current-user.service';

describe('CurrentUser Service', () => {
  beforeEachProviders(() => [CurrentUserService]);

  it('login should set the user and jwt', inject([CurrentUserService], (service: CurrentUserService) => {
      service.login('testUser', 'testJwt');
      expect(service.user).toBe('testUser');
      expect(service.jwt).toBe('testJwt');
      expect(window.localStorage.getItem('user')).toBe('testUser');
      expect(window.localStorage.getItem('jwt')).toBe('testJwt');
  }));

  it('pulls in initial saved values from local storage',
    inject([CurrentUserService], (service: CurrentUserService) => {
      expect(service.user).toBe('testUser');
      expect(service.jwt).toBe('testJwt');
      window.localStorage.removeItem('user');
      window.localStorage.removeItem('jwt');
  }));

  it('should ...',
    inject([CurrentUserService], (service: CurrentUserService) => {
      expect(service).toBeTruthy();
    })
  );
});
*/

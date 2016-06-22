import {
  beforeEachProviders,
  it,
  describe,
  expect,
  inject
} from '@angular/core/testing';
import { SocketService } from './socket.service';

describe('Socket Service', () => {
  beforeEachProviders(() => [SocketService]);

  it('should ...',
      inject([SocketService], (service: SocketService) => {
    expect(service).toBeTruthy();
  }));
});

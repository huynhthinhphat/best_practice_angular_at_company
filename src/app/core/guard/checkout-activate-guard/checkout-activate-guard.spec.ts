import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { checkoutActivateGuard } from './checkout-activate-guard';

describe('checkoutActivateGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => checkoutActivateGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});

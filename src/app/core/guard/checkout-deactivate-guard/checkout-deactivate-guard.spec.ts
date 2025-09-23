import { TestBed } from '@angular/core/testing';
import { CanDeactivateFn } from '@angular/router';

import { checkoutDeactivateGuard } from './checkout-deactivate-guard';
import { CheckoutPage } from '../../../pages/checkout-page/checkout-page';

describe('checkoutDeactivateGuard', () => {
  const executeGuard: CanDeactivateFn<CheckoutPage> = (...guardParameters) => 
      TestBed.runInInjectionContext(() => checkoutDeactivateGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});

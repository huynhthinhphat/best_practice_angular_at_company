import { CanDeactivateFn, Router } from '@angular/router';
import { CheckoutPage } from '../../../pages/checkout-page/checkout-page';
import { MESSAGES } from '../../../shared/constants/message.constants';
import { inject } from '@angular/core';
import { Location } from '@angular/common';

export const checkoutDeactivateGuard: CanDeactivateFn<CheckoutPage> = (_, __, ___, nextState) => {
  const location = inject(Location);
  const router = inject(Router);
  const navigation = router.getCurrentNavigation();
  const stateFromPage = navigation?.extras.state;

  if (stateFromPage?.['orderSuccess']) {
    return true;
  }

  const confirmLeave = confirm(MESSAGES.CONFIRM_EXIT);
   if (confirmLeave) {
    location.replaceState(nextState?.url ?? '/');
  }

  return confirmLeave;
};

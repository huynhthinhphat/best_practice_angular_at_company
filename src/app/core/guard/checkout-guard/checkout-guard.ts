import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const checkoutGuard: CanActivateFn = () => {
  const router = inject(Router);

  const navigation = router.getCurrentNavigation();

  const stateFromPage = navigation?.extras.state;

  if (!stateFromPage?.['fromProductDetailPage']
    && !stateFromPage?.['fromCartPage']
    && !stateFromPage?.['isAdmin']) {
    router.navigate(['/not-found']);
    return false;
  }

  return true;
};

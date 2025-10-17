import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { selectCurrentUser } from '../../../shared/services/user-service/state/user.selector';

export const checkoutActivateGuard: CanActivateFn = () => {
  const store = inject(Store);
  const router = inject(Router);
  const navigation = router.getCurrentNavigation();
  const stateFromPage = navigation?.extras.state;

  let currentUser = toSignal(store.select(selectCurrentUser));
  let user = currentUser();

  const redirectNotFoundPage = () => {
    router.navigate(['/not-found'], { replaceUrl: true });
    return false;
  }

  if (!user) { 
    redirectNotFoundPage();
  } 

  if (user!.role === 'User') {
    if (!stateFromPage?.['fromProductDetailPage'] && !stateFromPage?.['fromCartPage']) {
      redirectNotFoundPage();
    }
  }

  return true;
};

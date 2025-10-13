import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../../shared/services/auth-service/auth';
import { Store } from '@ngrx/store';
import { AppState } from '../../../app.state';
import { toSignal } from '@angular/core/rxjs-interop';
import { getCurrentUser } from '../../../pages/user-page/user.selector';

export const checkoutActivateGuard: CanActivateFn = () => {
  const store = inject(Store<AppState>);
  const router = inject(Router);
  const navigation = router.getCurrentNavigation();
  const stateFromPage = navigation?.extras.state;

  let currentUser = toSignal(store.select(getCurrentUser));
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

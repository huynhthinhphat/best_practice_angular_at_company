import { inject, signal } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { User } from '../../../shared/models/user.model';

export const checkoutActivateGuard: CanActivateFn = () => {
  const store = inject(Store);
  const router = inject(Router);
  const navigation = router.getCurrentNavigation();
  const stateFromPage = navigation?.extras.state;

  let currentUser = signal<User|null>(null);
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

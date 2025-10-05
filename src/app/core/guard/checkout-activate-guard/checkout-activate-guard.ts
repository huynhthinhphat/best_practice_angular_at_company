import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../../shared/services/auth-service/auth';

export const checkoutActivateGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const navigation = router.getCurrentNavigation();
  const stateFromPage = navigation?.extras.state;

  let user = authService.currentUser();

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

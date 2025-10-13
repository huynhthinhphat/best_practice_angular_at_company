import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../../shared/services/auth-service/auth';
import { map } from 'rxjs/operators';

export const RoleGuard: CanActivateFn = (route) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const expectedRoles = route.data['roles'];

  return authService.getRole().pipe(
    map(userRole => {
      if (!expectedRoles.includes(userRole)) {
        return router.parseUrl('/not-found');
      }
      return true;
    })
  );
};

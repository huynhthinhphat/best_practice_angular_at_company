import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { StorageService } from '../../../shared/services/storage-service/storage-service';
import { STORAGE_KEYS } from '../../../shared/constants/storage.constants';
import { User } from '../../../shared/models/user.model';

export const authGuard: CanActivateFn = () => {
  const storageService = inject(StorageService);
  const router = inject(Router);

  const user = storageService.getData<User>(STORAGE_KEYS.USER);
  if (!user) {
    router.navigate(['/not-found']);
    return false;
  }

  return true;
};

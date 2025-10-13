import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { inject } from '@angular/core';
import { StorageService } from '../../shared/services/storage-service/storage-service';
import { User } from '../../shared/models/user.model';
import { STORAGE_KEYS } from '../../shared/constants/storage.constants';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ERROR_MESSAGES } from '../../shared/constants/message.constants';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
  const storageService = inject(StorageService);
  const toastrService = inject(ToastrService);
  const router = inject(Router);

  const user = storageService.getData<User>(STORAGE_KEYS.USER);

  let clonedReq = req;
  // if (user?.token) {
  //   clonedReq = req.clone({
  //     setHeaders: {
  //       Authorization: `Bearer ${user.token}`
  //     }
  //   });
  // }

  // return next(clonedReq).pipe(
  //   tap({
  //     next: (event) => console.log('HTTP Response:', event),
  //     error: (err) => console.error('HTTP Error:', err)
  //   }),
  //   catchError((error: HttpErrorResponse) => {
  //     if (error.status === 401) {
  //       toastrService.error(ERROR_MESSAGES.SESSION_EXPIRED);
  //       router.navigate(['/login']);
  //     } else if (error.status === 403) {
  //       toastrService.error(ERROR_MESSAGES.NO_PERMISSION);
  //       router.navigate(['/home']);
  //     } else if (error.status === 404) {
  //       toastrService.error(ERROR_MESSAGES.NOT_FOUND);
  //       router.navigate(['/not-found']);
  //     } else if (error.status >= 500) {
  //       toastrService.error(ERROR_MESSAGES.SERVER_ERROR);
  //     } 

  //     return throwError(() => error);
  //   })
  // );

  return next(clonedReq)
};

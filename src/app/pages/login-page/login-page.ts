import { Component, inject, output } from '@angular/core';
import { AppForm } from '../../shared/app-form/app-form';
import { User } from '../../shared/models/user.model';
import { AuthService } from '../../shared/services/auth-service/auth';
import { Router } from '@angular/router';
import { FORM, SUCCESS_MESSAGES } from '../../shared/constants/message.constants';
import { ToastrService } from 'ngx-toastr';
import { CartService } from '../../shared/services/cart-service/cart-service';
import { REGISTER_URL } from '../../shared/constants/url.constants';
import { FormFields } from '../../shared/models/form-field.model';
import { Validators } from '@angular/forms';
import { AppState } from '../../app.state';
import { Store } from '@ngrx/store';
import { addLoggedInUserToList, setCurrentUser } from '../user-page/user.action';
import { StorageService } from '../../shared/services/storage-service/storage-service';
import { STORAGE_KEYS } from '../../shared/constants/storage.constants';
import { CartItem } from '../../shared/models/cart-item.model';
import { loadCarts } from '../cart-page/cart.action';
import { catchError, of, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-login-page',
  imports: [AppForm],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css'
})
export class LoginPage {
  private store = inject(Store<AppState>);
  private authService = inject(AuthService);
  private cartService = inject(CartService);
  private storageService = inject(StorageService);
  private toastrService = inject(ToastrService);
  private router = inject(Router);

  public emitState = output<boolean>();

  public fields: FormFields[] = [
    {
      name: 'username',
      label: 'Username',
      icon: 'fa-solid fa-user',
      type: 'text',
      validator: [Validators.required]
    },
    {
      name: 'password',
      label: 'Password',
      icon: 'fa-solid fa-lock',
      type: 'password',
      validator: [Validators.required]
    },
  ];
  public formTitle = FORM.LOGIN;
  public buttonLabel = FORM.LOGIN;
  public formLinkMessage = FORM.REGISTER_MESSAGE;
  public formLinkTitle = FORM.REGISTER;
  public formUrl = REGISTER_URL;

  public handleLogin(user: User) {
    if (!user) return;

    this.authService.getAccount(user)
      .pipe(
        tap(user => {
          if (!user || !user.id) return;

          this.authService.userId.set(user.id);

          const { password, ...userWithoutPassword } = user;
          this.store.dispatch(setCurrentUser({ user: userWithoutPassword }));

          const { role, username, ...userWithoutRoleAndUsername } = userWithoutPassword;
          this.storageService.saveData<User>(STORAGE_KEYS.USER, userWithoutRoleAndUsername);
        }),
        switchMap(user => {
          if (user.role === 'User') {
            return this.cartService.getCartItemsByUserId(user.id!)
              .pipe(
                tap((cartItems: CartItem[]) => {
                  if (cartItems.length === 0) return;

                  const cartId = cartItems[0].cartId;
                  if (!cartId) return;

                  this.storageService.saveData<string>(STORAGE_KEYS.CART, cartId);
                  this.store.dispatch(loadCarts({ cartItems: cartItems }))
                })
              )
          } else {
            this.router.navigate(['/admin/users'], { replaceUrl: true });
            return of(null);
          }
        }),
        catchError(err => {
          this.toastrService.error(err.message);
          return of(null);
        })
      ).subscribe({
        complete: () => {
          if (user.role === 'User') this.router.navigate(['/'], { replaceUrl: true });
          this.toastrService.success(SUCCESS_MESSAGES.LOGIN);
        }
      })
  }
}
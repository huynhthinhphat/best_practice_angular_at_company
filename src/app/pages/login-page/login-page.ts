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

@Component({
  selector: 'app-login-page',
  imports: [AppForm],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css'
})
export class LoginPage {
  private authService = inject(AuthService);
  private cartService = inject(CartService);
  private toastrService = inject(ToastrService);
  private router = inject(Router);
  
  public emitState = output<boolean>();

  public fields : FormFields[] = [
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
      .subscribe({
        next: (user: User) => {
          if (!user) return;

          this.authService.currentUser.set(user);

          if (user.role === 'User') {
            this.router.navigate(['/'], { replaceUrl: true });
            this.cartService.setCartId();
          } else {
            this.router.navigate(['/admin/users'], { state: { isAdmin: true }, replaceUrl: true });
          }

          this.toastrService.success(SUCCESS_MESSAGES.LOGIN);
        },
        error: (error) => {
          this.toastrService.error(error.message);
        }
      })
  }
}
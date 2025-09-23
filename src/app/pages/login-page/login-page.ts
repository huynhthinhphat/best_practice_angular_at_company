import { Component, inject } from '@angular/core';
import { AppForm } from '../../shared/app-form/app-form';
import { Validators } from '@angular/forms';
import { User } from '../../shared/models/user.model';
import { AuthService } from '../../shared/services/auth-service/auth';
import { Router } from '@angular/router';
import { FORM, SUCCESS_MESSAGES } from '../../shared/constants/message.constants';
import { ToastrService } from 'ngx-toastr';
import { CartService } from '../../shared/services/cart-service/cart-service';

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

  public fields = [
    { name: 'username', label: 'Username', type: 'text', validator: [] },
    { name: 'password', label: 'Password', type: 'password', validator: [] },
  ];
  public formTitle = FORM.LOGIN;
  public buttonLabel = FORM.LOGIN;
  public Validators = Validators;

  public handleLogin(user: User) {
    if (!user) return;

    this.authService.getAccount(user)
      .subscribe({
        next: (data) => {
          if (!data) return;

          let user: User = data;
          this.authService.currentUser.set(user);
          this.cartService.setCartId();

          if (user.role === 'User') {
            this.router.navigate(['/']);
          } else {
            this.router.navigate(['/admin/users'], { state: { isAdmin: true } });
          }

          this.toastrService.success(SUCCESS_MESSAGES.LOGIN);
        },
        error: (error) => {
          this.authService.errorSignal.set(error.message);
        }
      })
  }
}
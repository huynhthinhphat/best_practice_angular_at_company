import { Component, inject, signal } from '@angular/core';
import { AppForm } from '../../shared/app-form/app-form';
import { PasswordMatchValidator } from '../../core/validators/password-match.validator';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../../shared/models/user.model';
import { AuthService } from '../../shared/services/auth-service/auth';
import { Router } from '@angular/router';
import { FULLNAME_PATTERN, NO_SPACES, USERNAME_PATTERN } from '../../shared/constants/pattern.constant';
import { ERROR_MESSAGES, FORM, SUCCESS_MESSAGES } from '../../shared/constants/message.constants';
import { ToastrService } from 'ngx-toastr';
import { CartService } from '../../shared/services/cart-service/cart-service';
import { switchMap, throwError } from 'rxjs';

@Component({
  selector: 'app-register-page',
  imports: [AppForm, ReactiveFormsModule],
  templateUrl: './register-page.html',
  styleUrl: './register-page.css',
  standalone: true
})
export class RegisterPage {
  private authService = inject(AuthService);
  private cartService = inject(CartService);
  private router = inject(Router);
  private toastrService = inject(ToastrService);

  public fields = [
    { name: 'fullName', label: 'Fullname', type: 'text', validator: [Validators.pattern(FULLNAME_PATTERN)] },
    { name: 'username', label: 'Username', type: 'text', validator: [Validators.pattern(USERNAME_PATTERN)] },
    { name: 'password', label: 'Password', type: 'password', validator: [Validators.pattern(NO_SPACES), Validators.minLength(6)] },
    { name: 'confirmPassword', label: 'Confirm Password', type: 'password', validator: [] },
  ];
  public formTitle = FORM.REGISTER;
  public buttonLabel = FORM.REGISTER;
  public formValidator = PasswordMatchValidator;
  public errorMessage = signal<string>('');

  public handleRegister(user: User) {
    if (!user) return;

    this.authService.addAccount(user)
      .pipe(
        switchMap((data: User) => {
          if (!data) return throwError(() => new Error(ERROR_MESSAGES.CREATE_CART_FAILED));

          const user: User = data;
          return this.cartService.generateCart(user);
        })
      )
      .subscribe({
        next: (data) => {
          if (!data) return;

          this.toastrService.success(SUCCESS_MESSAGES.REGISTER);
          this.router.navigate(['/login']);
        },
        error: (error) => {
          this.authService.errorSignal.set(error.message);
        }
      })
  }
}

import { Component, inject, output, signal } from '@angular/core';
import { AppForm } from '../../shared/app-form/app-form';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../../shared/models/user.model';
import { AuthService } from '../../shared/services/auth-service/auth';
import { FULLNAME_PATTERN, NO_SPACES, USERNAME_PATTERN } from '../../shared/constants/pattern.constant';
import { ERROR_MESSAGES, FORM, SUCCESS_MESSAGES } from '../../shared/constants/message.constants';
import { ToastrService } from 'ngx-toastr';
import { CartService } from '../../shared/services/cart-service/cart-service';
import { switchMap, throwError } from 'rxjs';
import { Cart } from '../../shared/models/cart.model';
import { LOGIN_URL } from '../../shared/constants/url.constants';
import { FormFields } from '../../shared/models/form-field.model';

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
  private toastrService = inject(ToastrService);

  public fields : FormFields[] = [
    {
      name: 'fullName',
      label: 'Fullname',
      type: 'text',
      icon: 'fa-solid fa-user',
      validator: [Validators.pattern(FULLNAME_PATTERN)],
      errors: [
        { type: 'pattern', message: ERROR_MESSAGES.INVALID_FULLNAME }
      ]
    },
    {
      name: 'username',
      label: 'Username',
      type: 'text',
      icon: 'fa-solid fa-user',
      validator: [Validators.pattern(USERNAME_PATTERN)],
      errors: [
        { type: 'pattern', message: ERROR_MESSAGES.INVALID_USERNAME }
      ]
    },
    {
      name: 'password',
      label: 'Password',
      type: 'password',
      icon: 'fa-solid fa-lock',
      validator: [Validators.pattern(NO_SPACES), Validators.minLength(6)],
      errors: [
        { type: 'pattern', message: ERROR_MESSAGES.INVALID_PASSWORD },
        { type: 'minlength', message: ERROR_MESSAGES.PASSWORD_MINLENGTH }
      ]
    },
    {
      name: 'confirmPassword',
      label: 'Confirm Password',
      type: 'password',
      icon: 'fa-solid fa-lock',
      validator: []
    },
  ];
  public formTitle = FORM.REGISTER;
  public buttonLabel = FORM.REGISTER;
  public formLinkMessage = FORM.LOGIN_MESSAGE;
  public formLinkTitle = FORM.LOGIN;
  public formUrl = LOGIN_URL;
  public errorMessage = signal<string>('');
  public emitState = output<boolean>();

  public handleRegister(user: User) {
    if (!user) return;

    this.authService.addAccount(user)
      .pipe(
        switchMap((user: User) => {
          if (!user) return throwError(() => new Error(ERROR_MESSAGES.CREATE_USER_FAILED));
          return this.cartService.generateCart(user);
        })
      )
      .subscribe({
        next: (cart : Cart) => {
          if (!cart) return;

          this.toastrService.success(SUCCESS_MESSAGES.REGISTER);
          this.notifyParent(false);
        },
        error: (error) => {
          this.toastrService.error(error.message);
        }
      })
  }
    
  public notifyParent(isShow: boolean) {
    this.emitState.emit(isShow);
  }
}

import { Component, inject, signal } from '@angular/core';
import { AppForm } from '../../shared/app-form/app-form';
import { PasswordMatchValidator } from '../../core/validators/password-match.validator';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../../shared/models/user.model';
import { AuthService } from '../../shared/services/auth-service/auth';
import { Router } from '@angular/router';
import { USERNAME_PATTERN } from '../../shared/constants/pattern.constant';
import { SUCCESS_MESSAGES } from '../../shared/constants/message.constants';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register-page',
  imports: [AppForm, ReactiveFormsModule],
  templateUrl: './register-page.html',
  styleUrl: './register-page.css',
  standalone: true
})
export class RegisterPage {
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastrService = inject(ToastrService);

  public fields = [
    { name: 'fullName', label: 'Họ và tên', type: 'text', validator: [] },
    { name: 'username', label: 'Tài khoản', type: 'text', validator: [Validators.pattern(USERNAME_PATTERN)] },
    { name: 'password', label: 'Mật khẩu', type: 'password', validator: [Validators.minLength(6)] },
    { name: 'confirmPassword', label: 'Xác nhận mật khẩu', type: 'password', validator: [] },
  ];
  public formTitle = "Đăng ký";
  public buttonLabel = "Đăng ký";
  public formMessage = "Bạn đã có tài khoản?";
  public formLink = "/login";
  public formLinkText = "Đăng nhập";
  public formValidator = PasswordMatchValidator;
  public errorMessage = signal<string>('');

  public handleRegister(user : User){
    if(!user) return;

    this.authService.addAccount(user).subscribe({
      next: (data) => {
        if(data){
          this.toastrService.success(SUCCESS_MESSAGES.REGISTER);
          this.router.navigate(['/login']);
        }
      },
      error: (error) => {
        this.authService.errorSignal.set(error.message);
      }
    })
  }
}

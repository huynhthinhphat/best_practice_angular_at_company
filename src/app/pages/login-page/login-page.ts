import { Component, inject } from '@angular/core';
import { AppForm } from '../../shared/app-form/app-form';
import { Validators } from '@angular/forms';
import { User } from '../../shared/models/user.model';
import { AuthService } from '../../shared/services/auth-service/auth';
import { Router } from '@angular/router';
import { SUCCESS_MESSAGES } from '../../shared/constants/message.constants';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login-page',
  imports: [AppForm],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css'
})
export class LoginPage {
  private authService = inject(AuthService);
  private toastrService = inject(ToastrService);
  private router = inject(Router);

  public fields = [
    { name: 'username', label: 'Tài khoản', type: 'text', validator: [] },
    { name: 'password', label: 'Mật khẩu', type: 'password', validator: [] },
  ];
  public formTitle = "Đăng nhập" ;
  public buttonLabel = "Đăng nhập";
  public formMessage = "Bạn chưa có tài khoản?";
  public formLink = "/register";
  public formLinkText = "Đăng ký";
  public Validators = Validators;

  public handleLogin(user: User){
    if(!user) return;
    
    this.authService.getAccount(user)
    .subscribe({
      next: (data) => {
        if(!data) return;

        let user : User = data;
        this.authService.currentUserSignal.set(user);

        this.router.navigate(['/']);
        this.toastrService.success(SUCCESS_MESSAGES.LOGIN);
      },
      error: (error) => {
        this.authService.errorSignal.set(error.message);
      }
    })
  }
}
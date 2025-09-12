import { Component, inject } from '@angular/core';
import { AppForm } from '../../shared/app-form/app-form';
import { Validators } from '@angular/forms';
import { User } from '../../shared/models/user.model';
import { AuthService } from '../../shared/services/auth-service/auth';
import { Router } from '@angular/router';
import { SUCCESS_MESSAGES } from '../../shared/constants/message.constants';

@Component({
  selector: 'app-login-page',
  imports: [AppForm],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css'
})
export class LoginPage {
  private authService = inject(AuthService);
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

  public handleLogin(user: any){
    if(!user) return;
    
    this.authService.getUserByUsernameAndPassword(user.username, user.password).subscribe({
      next: (res) => {
        if(res.length === 0){
          this.authService.errorSignal.set(SUCCESS_MESSAGES.loginFailed);
          return;
        }
        this.authService.saveUserToStorage(res[0]);

        this.authService.clearErrorSignal();
        
        alert(SUCCESS_MESSAGES.login);
        window.location.href = '/';
      },
      error: (error) => {
        console.error(error);
      }
    })
  }
}

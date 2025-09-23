import { Component, signal } from '@angular/core';
import { LoginPage } from '../../pages/login-page/login-page';
import { RegisterPage } from '../../pages/register-page/register-page';

@Component({
  selector: 'app-auth-layout',
  imports: [LoginPage, RegisterPage],
  templateUrl: './auth-layout.html',
  styleUrl: './auth-layout.scss'
})
export class AuthLayout {
  public isVisible = signal<boolean>(false);

  public handleView() {
    this.isVisible.set(!this.isVisible());
  }
}

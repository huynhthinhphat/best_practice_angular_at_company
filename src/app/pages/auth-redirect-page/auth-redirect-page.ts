import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../shared/services/auth-service/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth-redirect-page',
  imports: [],
  templateUrl: './auth-redirect-page.html',
  styleUrl: './auth-redirect-page.css'
})
export class AuthRedirectPage implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit() {
    const isAdmin = this.authService.isAdmin();

    if (isAdmin) {
      this.router.navigate(['/admin']);
      return;
    }

    this.router.navigate(['/home']);
    return;
  }
}

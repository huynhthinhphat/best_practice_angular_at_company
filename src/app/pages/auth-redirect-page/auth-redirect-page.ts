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
    this.authService.getRole().subscribe({
      next: (role: string) => {
        if (role === 'Admin') {
          this.router.navigate(['/admin/users']);
          return;
        }

        this.router.navigate(['/home']);
      },
      error: () => this.router.navigate(['/home'])
    })
  }
}

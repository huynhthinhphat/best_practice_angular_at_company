import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CategoryService } from '../../shared/services/category-service/category-service';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../shared/services/product-service/product-service';
import { AuthService } from '../../shared/services/auth-service/auth';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-left-side-page',
  imports: [CommonModule, RouterLink],
  templateUrl: './left-side-page.html',
  styleUrl: './left-side-page.css'
})
export class LeftSidePage implements OnInit, OnDestroy {
  private categoryService = inject(CategoryService);
  private productService = inject(ProductService);
  private authService = inject(AuthService);
  private router = inject(Router);

  public currentUser = this.authService.currentUser;
  public categories = this.categoryService.categories;
  public selectedCategoryId = signal<string>('');
  public routers: string[] = [];

  public ngOnInit() {
    if (this.currentUser()?.role === 'Admin') {
      this.routers = ['users', 'products', 'categories', 'orders'];

      const router = this.routers[0];
      this.selectedCategoryId.set(router);
      this.router.navigate([`/admin/${router}`], { state: { isAdmin: true } });
    }
  }

  public onCategoryClick(categoryId: string) {
    if (!this.currentUser() || this.currentUser()?.role === 'User') {
      this.productService.categoryId.set(categoryId);
    }

    this.selectedCategoryId.set(categoryId);
  }

  public ngOnDestroy() {
    this.selectedCategoryId.set('');
  }
}

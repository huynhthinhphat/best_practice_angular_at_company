import { Component, effect, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../shared/services/auth-service/auth';
import { ProductService } from '../../shared/services/product-service/product-service';
import { CartService } from '../../shared/services/cart-service/cart-service';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../shared/services/theme-service/theme-service';

@Component({
  selector: 'app-header-page',
  imports: [RouterModule, CommonModule],
  templateUrl: './header-page.html',
  styleUrl: './header-page.scss'
})
export class HeaderPage {
  private authService = inject(AuthService);
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private themeService = inject(ThemeService);
  private router = inject(Router);

  public isVisible = false;
  public currentUser = this.authService.currentUser;
  public quantityItems = this.cartService.quantityItems;
  public products = this.productService.products;
  public productName = '';
  public isShowMenu = signal<boolean>(false);
  public isShowInputSearch = signal<boolean>(false);
  public isDarkMode = this.themeService.isDarkMode;

  constructor() {
    effect(() => {
      this.isVisible = this.authService.currentUser() ? true : false;
    })
  }

  public searchProduct(data: string) {
    if (!this.router.url.includes('/home')) {
      this.router.navigate(['/home']);
    }

    this.productService.productName.set(data);
  }

  public toggleInputSearch() {
    this.isShowInputSearch.set(!this.isShowInputSearch());
  }

  public toggleMenu() {
    this.isShowMenu.set(!this.isShowMenu());
  }

  public toggleTheme(){
    this.themeService.toggleTheme();
  }

  public redirectPage(pageName: string) {
    if (!pageName) return;
    
    if (pageName === 'cart') {
      this.router.navigate(['cart', this.currentUser()?.id])
    } else if (pageName === 'order') {
      this.router.navigate(['/orders/user'])
    } else {
      this.authService.logout();
      this.router.navigate(['/home']);
    }

    this.isShowMenu.set(!this.isShowMenu());
  }
}
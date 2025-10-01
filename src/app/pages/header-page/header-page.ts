import { Component, effect, ElementRef, HostListener, inject, signal, viewChild } from '@angular/core';
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
  private menuWrapper = viewChild<ElementRef>('menuWrapper');

  private authService = inject(AuthService);
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private themeService = inject(ThemeService);
  private router = inject(Router);

  public isLoginIn = signal<boolean>(false);
  public currentUser = this.authService.currentUser;
  public quantityItems = this.cartService.quantityItems;
  public products = this.productService.products;
  public productName = '';

  public isShowMenu = signal<boolean>(false);
  public isShowInputSearch = signal<boolean>(false);
  public isDarkMode = this.themeService.isDarkMode;

  public titleOrder = 'Orders';
  public titleCart = 'Cart';
  public titleMode = 'Toggle Dark/Light Mode';

  public firstCharacter = signal<string>('');

  constructor() {
    effect(() => {
      const user = this.authService.currentUser();

      this.isLoginIn.set(user ? true : false);
      this.setAvatarName();
    })
  }

  @HostListener('document:click', ['$event'])
  public onClickOutside(event: MouseEvent) {
    if (this.isShowMenu() && !this.menuWrapper()!.nativeElement.contains(event.target)) {
       this.isShowMenu.set(false);
    }
  }

  private setAvatarName() {
    const user = this.authService.currentUser();
    if (!user) return;

    const fullName = user.fullName?.trim();
    if (!fullName?.trim() || fullName?.trim().length === 0) {
      this.firstCharacter.set('A');
      return;
    }

    this.firstCharacter.set(fullName.charAt(0).toUpperCase());  
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

  public logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
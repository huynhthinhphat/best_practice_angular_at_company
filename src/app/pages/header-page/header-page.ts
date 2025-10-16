import { Component, computed, effect, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../shared/services/auth-service/auth';
import { ProductService } from '../../shared/services/product-service/product-service';
import { CartService } from '../../shared/services/cart-service/cart-service';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../shared/services/theme-service/theme-service';
import { BUTTON_TOOLTIP } from '../../shared/constants/message.constants';
import { Store } from '@ngrx/store';
import { AppState } from '../../state/app.state';
import { toSignal } from '@angular/core/rxjs-interop';
import { selectProductsByCondition } from '../../shared/services/product-service/state/product.selector';
import { setCurrentUser } from '../../shared/services/user-service/state/user.action';
import { getCurrentUser } from '../../shared/services/user-service/state/user.selector';

@Component({
  selector: 'app-header-page',
  imports: [RouterModule, CommonModule],
  templateUrl: './header-page.html',
  styleUrl: './header-page.scss'
})
export class HeaderPage {
  private store = inject(Store<AppState>);
  private authService = inject(AuthService);
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private themeService = inject(ThemeService);
  private router = inject(Router);

  public userId = this.authService.userId;
  public isLoginIn = signal<boolean>(false);
  public currentUser = toSignal(this.store.select(getCurrentUser));
  public quantityItems = this.cartService.quantityItems;
  public productList = toSignal(this.store.select(selectProductsByCondition, { startIndex: 0, endIndex: 10 }), { initialValue: [] });

  public isShowMenu = signal<boolean>(false);
  public isShowInputSearch = signal<boolean>(false);
  public isDarkMode = this.themeService.isDarkMode;

  public titleOrder = BUTTON_TOOLTIP.ORDER;
  public titleCart = BUTTON_TOOLTIP.CART;
  public titleMode = BUTTON_TOOLTIP.MODE;

  public firstCharacter = signal<string>('');

  constructor() {
    effect(() => {
      if (!this.userId()) return;

      const user = this.currentUser();
      this.isLoginIn.set(!!user);

      if (this.isLoginIn()) {
        this.setAvatarName();
      }
    })
  }

  private setAvatarName() {
    const user = this.currentUser();
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

  public toggleTheme() {
    this.themeService.toggleTheme();
  }

  public logout() {
    const user = this.currentUser();
    if (!user || !user.id) return;

    this.store.dispatch(setCurrentUser({ user: null }))
    localStorage.clear();

    this.router.navigate(['/home']);
  }
}
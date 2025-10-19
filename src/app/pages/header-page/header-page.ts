import { Component, computed, effect, inject, OnDestroy, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ProductService } from '../../shared/services/product-service/product-service';
import { CartService } from '../../shared/services/cart-service/cart-service';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../shared/services/theme-service/theme-service';
import { BUTTON_TOOLTIP } from '../../shared/constants/message.constants';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { selectProductsByConditions } from '../../shared/services/product-service/state/product.selector';
import { removeLoggedInUser } from '../../shared/services/user-service/state/user.action';
import { selectUser } from '../../shared/services/user-service/state/user.selector';
import { CategoryService } from '../../shared/services/category-service/category-service';

@Component({
  selector: 'app-header-page',
  imports: [RouterModule, CommonModule],
  templateUrl: './header-page.html',
  styleUrl: './header-page.scss'
})
export class HeaderPage implements OnDestroy{
  private store = inject(Store);
  private cartService = inject(CartService);
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  private themeService = inject(ThemeService);
  private router = inject(Router);

  public currentUser = toSignal(this.store.select(selectUser));
  public quantityItems = this.cartService.quantityItems;
  public productList = toSignal(this.store.select(selectProductsByConditions, { productName: this.productService.productName(), categoryName: this.categoryService.categoryName(), startIndex: 0, endIndex: 10 }), { initialValue: [] });

  public isShowMenu = signal<boolean>(false);
  public isShowInputSearch = signal<boolean>(false);
  public isDarkMode = this.themeService.isDarkMode;

  public titleOrder = BUTTON_TOOLTIP.ORDER;
  public titleCart = BUTTON_TOOLTIP.CART;
  public titleMode = BUTTON_TOOLTIP.MODE;

  public firstCharacter = signal<string>('');

  constructor() {
    effect(() => {
      if (this.currentUser()) {
        this.setAvatarName();
      }
    })
  }

  private setAvatarName() {
    const fullName = this.currentUser()!.fullName?.trim();
    if (!fullName || fullName.length === 0) {
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

  public toggleMenu() {
    this.isShowMenu.set(!this.isShowMenu());
  }

  public toggleTheme() {
    this.themeService.toggleTheme();
  }

  public logout() {
    this.store.dispatch(removeLoggedInUser())
    localStorage.clear();

    this.router.navigate(['/home']);
  }

  ngOnDestroy() {
      this.productService.productName.set('')
  }
}
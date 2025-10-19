import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from './shared/services/theme-service/theme-service';
import { Store } from '@ngrx/store';
import { take } from 'rxjs';
import { loadCategories } from './shared/services/category-service/state/category.action';
import { loadProducts } from './shared/services/product-service/state/product.action';
import { loadUser } from './shared/services/user-service/state/user.action';
import { selectUser } from './shared/services/user-service/state/user.selector';
import { selectAllCategories } from './shared/services/category-service/state/category.selector';
import { selectProductsByConditions } from './shared/services/product-service/state/product.selector';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  private store = inject(Store);
  private themeService = inject(ThemeService);

  ngOnInit() {
    document.body.classList.toggle('dark-mode', this.themeService.getTheme() === 'dark');
    this.loadData();
  }

  private loadData() {
    this.store.select(selectUser).pipe(take(1)).subscribe(user => {
      if (!user) {
        this.store.dispatch(loadUser());
      }
    });

    this.store.select(selectAllCategories).pipe(take(1)).subscribe(categories => {
      if (categories.length === 0) {
        this.store.dispatch(loadCategories());
      }
    });

    this.store.select(selectProductsByConditions, {productName: '', categoryName: '', startIndex: 0, endIndex: -1}).pipe(take(1)).subscribe(products => {
      if (products.length === 0) {
        this.store.dispatch(loadProducts());
      }
    });
  }
}

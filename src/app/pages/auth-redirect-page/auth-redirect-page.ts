import { Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { loadCategories } from '../../shared/services/category-service/state/category.action';
import { loadProducts } from '../../shared/services/product-service/state/product.action';
import { loadUser } from '../../shared/services/user-service/state/user.action';

@Component({
  selector: 'app-auth-redirect-page',
  imports: [],
  templateUrl: './auth-redirect-page.html',
  styleUrl: './auth-redirect-page.css'
})
export class AuthRedirectPage implements OnInit {
  private store = inject(Store);

  ngOnInit() {
  }
}

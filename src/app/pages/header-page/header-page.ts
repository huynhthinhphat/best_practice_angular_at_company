import { Component, effect, inject, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../shared/services/auth-service/auth';
import { ProductService } from '../../shared/services/product-service/product-service';
import { CartService } from '../../shared/services/cart-service/cart-service';

@Component({
  selector: 'app-header-page',
  imports: [RouterModule],
  templateUrl: './header-page.html',
  styleUrl: './header-page.css'
})
export class HeaderPage implements OnDestroy{
  private authService = inject(AuthService);
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private router = inject(Router);

  public isVisible = false;
  public currentUserSignal = this.authService.currentUserSignal;
  public quantityItems = this.cartService.quantityItems;
  public products = this.productService.products;
  public productName = '';
  private searchTimeout: any;

  constructor(){
    effect(() => {
      this.isVisible = this.authService.currentUserSignal() ? true : false;
    })
  }

  searchProduct(data: string) {
    this.searchTimeout = setTimeout(() => {
      if(!this.router.url.includes('/home')){
        this.router.navigate(['/home']);
      }

      this.productService.productName.set(data);
    }, 1000);
  }

  logout(){
    this.authService.logout();
    this.router.navigate(['/']);
  }

  ngOnDestroy(){
    clearTimeout(this.searchTimeout);
  }
}
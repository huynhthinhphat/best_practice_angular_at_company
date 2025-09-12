import { Component, effect, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../shared/services/auth-service/auth';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../shared/services/product-service/product-service';

@Component({
  selector: 'app-header-page',
  imports: [RouterModule, CommonModule],
  templateUrl: './header-page.html',
  styleUrl: './header-page.css'
})
export class HeaderPage implements OnDestroy{
  private authService = inject(AuthService);
  private productService = inject(ProductService);

  public isVisible = false;
  public currentUserSignal = this.authService.currentUserSignal;
  public products = this.productService.products;
  public productName = '';
  private searchTimeout: any;

  constructor(){
    effect(() => {
      const user = this.authService.currentUserSignal;
      if(user !== null){
        this.isVisible = true;
      }
    })
  }

  logout(){
    this.authService.logout();
    this.isVisible = false;
  }

  searchProduct(data: string) {
    this.searchTimeout = setTimeout(() => {
      this.productService.productName.set(data);
    }, 1000);
  }

  ngOnDestroy(){
    clearTimeout(this.searchTimeout);
  }
}
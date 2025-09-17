import { Component, inject, OnInit } from '@angular/core';
import { ProductService } from '../../../shared/services/product-service/product-service';
import { NgOptimizedImage } from '@angular/common';
import { Router } from '@angular/router';
import { AppPagination } from '../../../shared/app-pagination/app-pagination';

@Component({
  selector: 'app-product-page',
  imports: [NgOptimizedImage, AppPagination],
  templateUrl: './product-list-page.html',
  styleUrl: './product-list-page.css',
  standalone: true
})
export class ProductListPage implements OnInit{
  private productService = inject(ProductService);
  private router = inject(Router);

  public products = this.productService.products;

  ngOnInit() {
    this.productService.getAllProductsByConditions();
  }

  public onClickProduct(productId: string) {
    if(!productId) return;
   
    this.router.navigate(['/products/details', productId]);
  }
}

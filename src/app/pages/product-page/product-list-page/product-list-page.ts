import { Component, inject, OnInit } from '@angular/core';
import { ProductService } from '../../../shared/services/product-service/product-service';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-page',
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './product-list-page.html',
  styleUrl: './product-list-page.css'
})
export class ProductListPage implements OnInit{
  private productService = inject(ProductService);
  private router = inject(Router);

  public products = this.productService.products;

  ngOnInit() {
    this.setProducts();
  }

  private setProducts(){
    this.productService.getAllProductsByConditions();
  }

  public trackById(item: any) {
    return item.id; 
  }

  public onClickProduct(productId: string) {
    this.router.navigate(['/products/details', productId]);
  }
}

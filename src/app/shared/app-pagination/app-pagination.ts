import { Component, effect, inject, signal } from '@angular/core';
import { ProductService } from '../services/product-service/product-service';
import { PaginationResponse } from '../models/pagination-response.model';
import { Product } from '../models/product.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-app-pagination',
  imports: [CommonModule],
  templateUrl: './app-pagination.html',
  styleUrl: './app-pagination.css'
})
export class AppPagination{
  private productService = inject(ProductService);

  public pagination = signal<PaginationResponse<Product> | null>(null);
  public currentPage = this.productService.currentPage;
  public start : number = 0;
  public end : number = 0;

  constructor() {
    effect(() => {
      this.pagination.set(this.productService.pagination());

      if(this.pagination()){
        this.calculateRange(this.pagination()!);
      }
    });
  }

  public goToPage(page: number) {
    this.productService.currentPage.set(page);
    this.productService.getAllProductsByConditions(page.toString());
  }

  public range(startPage: number, endPage: number): number[]{
    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  }

  private calculateRange(pagination: PaginationResponse<Product>) {
    if (pagination.prev === null) {
      this.start = 1;
      this.end = pagination.pages! <= 2 ? 2 : 3;
      return;
    } 
    
    if (pagination.next === null) {
      this.start = pagination.pages! <= 2 ? pagination.prev! : pagination.last! - 2;
      this.end = pagination.last!;
      return;
    } 
    
    this.start = pagination.prev!;
    this.end = pagination.next!;
  }
}

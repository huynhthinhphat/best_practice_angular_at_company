import { Component, inject, OnInit } from '@angular/core';
import { CategoryService } from '../../shared/services/category-service/category-service';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../shared/services/product-service/product-service';

@Component({
  selector: 'app-left-side-page',
  imports: [CommonModule],
  templateUrl: './left-side-page.html',
  styleUrl: './left-side-page.css'
})
export class LeftSidePage{
  private categoryService = inject(CategoryService);
  private productService = inject(ProductService);

  public categories = this.categoryService.categories;
  public selectedCategoryId : string = '';

  public onCategoryClick(categoryId: string) {
    this.selectedCategoryId = categoryId;
    this.productService.categoryId.set(categoryId);
  }
}

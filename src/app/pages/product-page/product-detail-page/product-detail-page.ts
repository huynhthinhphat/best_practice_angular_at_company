import { CurrencyPipe, NgOptimizedImage } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../shared/services/product-service/product-service';
import { Product } from '../../../shared/models/product.model';
import { CategoryService } from '../../../shared/services/category-service/category-service';
import { of, switchMap } from 'rxjs';
import { CartService } from '../../../shared/services/cart-service/cart-service';
import { ToastrService } from 'ngx-toastr';
import { SUCCESS_MESSAGES } from '../../../shared/constants/message.constants';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { StorageService } from '../../../shared/services/storage-service/storage-service';
import { STORAGE_KEYS } from '../../../shared/constants/storage.constants';

@Component({
  selector: 'app-product-detail-page',
  imports: [CurrencyPipe, NgOptimizedImage, FormsModule],
  templateUrl: './product-detail-page.html',
  styleUrls: ['./product-detail-page.css']
})
export class ProductDetailPage implements OnInit {
  private route = inject(ActivatedRoute);
  private toastr = inject(ToastrService);
  private router = inject(Router);
  private changeDetectorRef = inject(ChangeDetectorRef);
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  private cartService = inject(CartService);
  private storageService = inject(StorageService);

  public product!: Product;
  public quantityItem: number = 1;

  ngOnInit() {
    this.getProductById();
  }

  public handleQuantityChange(newQuantity: number) {
    const stock = this.product.stock ?? 0;
    this.quantityItem = Math.max(1, Math.min(newQuantity, stock));
  }

  private getProductById() {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.productService.getProductById(productId)
        .pipe(
          switchMap(product => {
            if (product.categoryId) {
              this.product = product;
              return this.categoryService.getCategoryById(product.categoryId);
            }
            return of(null);
          })
        )
        .subscribe({
          next: (category) => {
            if (category) {
              this.product.categoryName = category.name;
              this.changeDetectorRef.detectChanges();
            }
          },
          error: (error) => {
            this.toastr.error(error.message);
          },
        });
    }
  }

  public updateCartItemToCart() {
    if (!this.product) return;

    this.cartService.handleCartItemToUpdate(this.product, this.quantityItem).subscribe({
      next: (cart) => {
        if (cart) {
          this.cartService.getCartByCartId();
          this.toastr.success(SUCCESS_MESSAGES.ADD_TO_CART);
        }
      },
      error: (error) => {
        this.toastr.error(error.message);
      },
    });
  }

  public navigateToCheckout(product: Product) {
    if (!product) return;

    product = { ...product, quantityToBuy: 1 };
    this.storageService.saveData<Product[]>(STORAGE_KEYS.CHECKOUT_PRODUCT_LIST, [product]);

    this.router.navigate(['/checkout']);
  }
}

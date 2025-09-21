import { CurrencyPipe, NgOptimizedImage } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../../shared/models/product.model';
import { CartService } from '../../../shared/services/cart-service/cart-service';
import { ToastrService } from 'ngx-toastr';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../../../shared/constants/message.constants';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { StorageService } from '../../../shared/services/storage-service/storage-service';
import { STORAGE_KEYS } from '../../../shared/constants/storage.constants';
import { User } from '../../../shared/models/user.model';

@Component({
  selector: 'app-product-detail-page',
  imports: [CurrencyPipe, NgOptimizedImage, FormsModule],
  templateUrl: './product-detail-page.html',
  styleUrls: ['./product-detail-page.css']
})
export class ProductDetailPage implements OnInit {
  private route = inject(ActivatedRoute);
  private toastrService = inject(ToastrService);
  private router = inject(Router);
  private cartService = inject(CartService);
  private storageService = inject(StorageService);

  public product!: Product;
  public quantityItem: number = 1;

  public ngOnInit() {
    this.loadProduct();
  }

  public handleQuantityChange(newQuantity: number) {
    const stock = this.product.stock ?? 0;
    this.quantityItem = Math.max(1, Math.min(newQuantity, stock));
  }

  private loadProduct() {
    const product = this.route.snapshot.data['product'];
    if (!product) return;

    this.product = product;
  }

  public updateCartItemToCart() {
    if (!this.product) return;

    this.cartService.handleCartItemToUpdate(this.product, this.quantityItem).subscribe({
      next: (cart) => {
        if (cart) {
          this.cartService.getCartByCartId();
          this.toastrService.success(SUCCESS_MESSAGES.ADD_TO_CART);
        }
      },
      error: (error) => {
        this.toastrService.error(error.message);
      },
    });
  }

  public navigateToCheckout(product: Product) {
    const user = this.storageService.getData<User>(STORAGE_KEYS.USER);
    if (!user) {
      this.toastrService.error(ERROR_MESSAGES.LOGIN_REQUIRED);
      return;
    }

    if (!product) return;

    product = { ...product, quantityToBuy: this.quantityItem };
    this.storageService.saveData<Product[]>(STORAGE_KEYS.CHECKOUT_PRODUCT_LIST, [product]);

    this.router.navigate(['/checkout'], { state: { fromProductDetailPage: true } });
  }
}

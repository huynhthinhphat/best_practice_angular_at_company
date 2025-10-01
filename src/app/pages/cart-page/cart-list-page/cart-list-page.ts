import { ScrollingModule } from '@angular/cdk/scrolling';
import { CurrencyPipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { SUCCESS_MESSAGES, SWAL_MESSAGES } from '../../../shared/constants/message.constants';
import { STORAGE_KEYS } from '../../../shared/constants/storage.constants';
import { DisableButton } from '../../../shared/directives/disable-button/disable-button';
import { CartItem } from '../../../shared/models/cart-item.model';
import { Cart } from '../../../shared/models/cart.model';
import { Product } from '../../../shared/models/product.model';
import { CartService } from '../../../shared/services/cart-service/cart-service';
import { StorageService } from '../../../shared/services/storage-service/storage-service';

@Component({
  selector: 'app-cart-list-page',
  imports: [CurrencyPipe, ScrollingModule, FormsModule, DisableButton],
  templateUrl: './cart-list-page.html',
  styleUrl: './cart-list-page.css',
  standalone: true
})
export class CartListPage implements OnInit {
  private cartService = inject(CartService);
  private storageService = inject(StorageService);
  private router = inject(Router);
  private toastrService = inject(ToastrService);

  public cart!: Cart;
  public cartItems = this.cartService.cartItems;
  public totalPrice = this.cartService.totalPrice;
  public selectedCartItems = signal<CartItem[]>([]);
  public isDisable: boolean = false;

  public ngOnInit() {
    this.cartService.getCartByCartId();
  }

  public onClickProduct(productId: string) {
    this.router.navigate(['/products/detail', productId]);
  }

  public handleDeleteCartItem(itemIdList: string[] = []) {
    Swal.fire({
      title: SWAL_MESSAGES.CONFIRM_DELETE_TITLE,
      text: SWAL_MESSAGES.CONFIRM_DELETE_TEXT,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: SWAL_MESSAGES.BUTTON_CONFIRM_DELETE,
      cancelButtonText: SWAL_MESSAGES.BUTTON_CANCEL,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6'
    }).then((result) => {
      if (!result.isConfirmed || !itemIdList) return;

      if (itemIdList.length > 0) {
        this.deleteCartItems(itemIdList);
        return;
      }

      const ids = this.selectedCartItems().map(item => item.id as string);
      if (ids.length === 0) return;

      this.deleteCartItems(ids);
      this.selectedCartItems.set([]);
    });
  }

  private deleteCartItems(idList: string[]) {
    if (idList.length === 0) return;

    this.cartService.deleteCartItems(idList).subscribe({
      next: (() => this.toastrService.success(SUCCESS_MESSAGES.DELETE)),
      error: (error) => this.toastrService.error(error.message)
    });
  }

  public handleCartItemToCart(product: Product, action: string = '', quantityChange: number = 0, index: number = -1) {
    let quantity: number = 0;

    let currentQuantity = this.cartItems()[index].quantity || 1;
    if (action === 'increase') {
      if (currentQuantity + 1 > product.stock!) return;
      quantity = 1;
    } else if (action === 'decrease') {
      if (currentQuantity - 1 < 1) return;
      quantity = -1;
    } else {
      if (index !== -1) {
        let quantity = Number(quantityChange);
        if (isNaN(quantity)) {
          this.cartItems()[index].quantity = 1;
        } else {
          if (quantity < 1) {
            this.cartItems()[index].quantity = 1;
          } else if (quantity > product.stock!) {
            this.cartItems()[index].quantity = product.stock!;
          }
        }
      }
    }

    this.cartService.handleCartItemToUpdate(product, quantity).subscribe({
      next: (cart) => {
        if (!cart) return;
        this.cartService.getCartByCartId();
      },
      error: (error) => {
        this.toastrService.error(error.message);
      },
    });
  }

  public trackById(item: any) {
    return item.id;
  }

  public selectedItems(cartItem: CartItem) {
    if (!cartItem) return;

    const isExist = this.selectedCartItems().find(p => p.id == cartItem.id);
    if (isExist) {
      this.selectedCartItems.set([...this.selectedCartItems().filter(p => p.id != cartItem.id)]);
      return;
    }

    this.selectedCartItems.set([...this.selectedCartItems(), cartItem]);
  }

  public selectedAll(checked: boolean) {
    this.selectedCartItems.set(checked ? [...this.cartItems()] : []);
  }

  public checkSelected(item: CartItem): boolean {
    return this.selectedCartItems().some(p => p.id == item.id);
  }

  public navigateToCheckout(product: Product | null) {
    let products: Product[] = [];

    if (product) {
      const item = this.cartItems().filter(item => item.product?.id == product?.id);
      product = { ...product, quantityToBuy: item[0]?.quantity || 0, cartItemId: item[0].id };
      products.push(product);
    } else {
      products = [...this.selectedCartItems().map(item => ({ ...item.product, quantityToBuy: item.quantity, cartItemId: item.id }))];
    }

    if (!products || products.length === 0) return;

    this.storageService.saveData<Product[]>(STORAGE_KEYS.CHECKOUT_PRODUCT_LIST, products);
    this.router.navigate(['/checkout'], { state: { fromCartPage: true } });
  }
}

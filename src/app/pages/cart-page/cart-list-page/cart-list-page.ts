import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../../shared/services/cart-service/cart-service';
import { CurrencyPipe } from '@angular/common';
import { Cart } from '../../../shared/models/cart.model';
import { StorageService } from '../../../shared/services/storage-service/storage-service';
import { STORAGE_KEYS } from '../../../shared/constants/storage.constants';
import { CartItem } from '../../../shared/models/cart-item.model';
import { ToastrService } from 'ngx-toastr';
import { SUCCESS_MESSAGES, SWAL_MESSAGES } from '../../../shared/constants/message.constants';
import { Product } from '../../../shared/models/product.model';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { FormsModule } from '@angular/forms'; 
import Swal from 'sweetalert2'

@Component({
  selector: 'app-cart-list-page',
  imports: [CurrencyPipe, ScrollingModule, FormsModule],
  templateUrl: './cart-list-page.html',
  styleUrl: './cart-list-page.css',
  standalone: true
})
export class CartListPage implements OnInit{
  private cartService = inject(CartService);
  private storageService = inject(StorageService);
  private router = inject(Router);
  private toastr = inject(ToastrService);

  public cart!: Cart;
  public cartItems = this.cartService.cartItems;
  public totalPrice = this.cartService.totalPrice;

  ngOnInit() {
      this.cartService.getCartByCartId();
  }

  public onClickProduct(productId: string) {
    this.router.navigate(['/products/details', productId]);
  }

  public handleDeleteCartItem(itemId: string | undefined) {
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
      if(!result.isConfirmed || !itemId) return;
      
      this.deleteCartItem(itemId);
    });
  }

  private deleteCartItem(itemId: string){
    this.cartService.deleteCartItem(itemId).subscribe({
      next: () => {
        this.cartItems.update(items => items.filter(item => item.id !== itemId));
        this.cartService.setTotalPrice();

        this.storageService.saveData<CartItem[]>(STORAGE_KEYS.CART_ITEMS, this.cartItems());
        this.cartService.quantityItems.update(val => val - 1);

        this.toastr.success(SUCCESS_MESSAGES.DELETE);
      },
      error: (error) => {
        this.toastr.error(error.message);
      }
    });
  }

  public handleCartItemToCart(product : Product, quantityChange: number){
    const newQuantity = Math.max(1, Math.min(quantityChange, product.stock!));

    this.cartService.handleCartItemToUpdate(product, newQuantity).subscribe({
      next: (cart) => {
        if(cart){
          this.cartService.getCartByCartId();
        }
      },
      error: (error) => {
        this.toastr.error(error.message);
      },
    });
  }

  public trackById(item: any) {
    return item.id; 
  }
}

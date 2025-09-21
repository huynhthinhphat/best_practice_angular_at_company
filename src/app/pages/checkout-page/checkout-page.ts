import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { StorageService } from '../../shared/services/storage-service/storage-service';
import { Product } from '../../shared/models/product.model';
import { STORAGE_KEYS } from '../../shared/constants/storage.constants';
import { AppForm } from '../../shared/app-form/app-form';
import { Validators } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { PHONE_NUMBER_PATTERN } from '../../shared/constants/pattern.constant';
import { Order } from '../../shared/models/order.model';
import { OrderService } from '../../shared/services/order-service/order-service';
import { ORDER_STATUS } from '../../shared/constants/order-status.constants';
import { ToastrService } from 'ngx-toastr';
import { ERROR_MESSAGES, SUCCESS_MESSAGES, SWAL_MESSAGES } from '../../shared/constants/message.constants';
import { Router } from '@angular/router';
import { User } from '../../shared/models/user.model';
import { CartService } from '../../shared/services/cart-service/cart-service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-checkout-page',
  imports: [AppForm, CurrencyPipe],
  templateUrl: './checkout-page.html',
  styleUrl: './checkout-page.css'
})
export class CheckoutPage implements OnInit, OnDestroy {
  private storageService = inject(StorageService);
  private orderService = inject(OrderService);
  private cartService = inject(CartService);
  private toastrService = inject(ToastrService);
  private router = inject(Router);

  public fields = [
    { name: 'username', label: 'Username', type: 'text', validator: [] },
    { name: 'phoneNumber', label: 'Phone', type: 'text', validator: [Validators.pattern(PHONE_NUMBER_PATTERN)] },
    { name: 'address', label: 'Address', type: 'text', validator: [] },
  ];
  public formTitle = "Information of order";
  public buttonLabel = "Pay";
  public Validators = Validators;
  public products = signal<Product[]>([]);

  public ngOnInit() {
    this.products.set(this.storageService.getData<Product[]>(STORAGE_KEYS.CHECKOUT_PRODUCT_LIST) ?? []);
  }

  get totalAmount() {
    return this.products().reduce((total, product) => total + (product.price ?? 0) * (product.quantityToBuy ?? 0), 0);
  }

  public handlePayment(order: Order) {
    if (!order) return;

    Swal.fire({
      title: SWAL_MESSAGES.CONFIRM_ORDER_TITLE,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: SWAL_MESSAGES.BUTTON_CONFIRM_ORDER,
      cancelButtonText: SWAL_MESSAGES.BUTTON_CANCEL,
      confirmButtonColor: 'green',
      cancelButtonColor: 'gray'
    }).then((result) => {
      if (!result.isConfirmed) return;

      const user = this.storageService.getData<User>(STORAGE_KEYS.USER);
      if (!user) {
        this.toastrService.error(ERROR_MESSAGES.NOT_FOUND_ACCOUNT);
        return;
      }

      const newOrder: Order = {
        ...order,
        userId: user?.id,
        quantity: this.products().length,
        totalPrice: this.totalAmount,
        status: ORDER_STATUS.PENDING,
        createdAt: new Date(),
      };

      this.createOrderAndHandleCart(newOrder);
    });
  }

  private createOrderAndHandleCart(order: Order) {
    this.orderService.createOrder(order)?.subscribe({
      next: (res) => {
        if (!res) return;

        if (history.state['fromCartPage']) {
          this.clearCartAfterCheckout();
        }

        this.router.navigate(['/orders/detail', res.id], { replaceUrl: true });
        this.toastrService.success(SUCCESS_MESSAGES.ORDER);
      },
      error: (error) => {
        this.toastrService.error(error.message);
      }
    });
  }

  private clearCartAfterCheckout() {
    const items = this.storageService.getData<Product[]>(STORAGE_KEYS.CHECKOUT_PRODUCT_LIST);
    if (items?.length === 0) return;

    const cartItemIds = items?.map(item => item.cartItemId ?? '');
    if (!cartItemIds || cartItemIds.length === 0) return;

    this.cartService.deleteCartItems(cartItemIds).subscribe({
      error: (error) => this.toastrService.error(error.message)
    });
  }

  public ngOnDestroy() {
    this.storageService.removeData(STORAGE_KEYS.CHECKOUT_PRODUCT_LIST);
  }
}

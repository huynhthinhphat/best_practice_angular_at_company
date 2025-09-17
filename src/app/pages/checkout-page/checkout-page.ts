import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ProductService } from '../../shared/services/product-service/product-service';
import { StorageService } from '../../shared/services/storage-service/storage-service';
import { Product } from '../../shared/models/product.model';
import { STORAGE_KEYS } from '../../shared/constants/storage.constants';
import { AppForm } from '../../shared/app-form/app-form';
import { Validators } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { PHONE_NUMBER_PATTERN } from '../../shared/constants/pattern.constant';
import { Order } from '../../shared/models/order.model';

@Component({
  selector: 'app-checkout-page',
  imports: [AppForm, CurrencyPipe],
  templateUrl: './checkout-page.html',
  styleUrl: './checkout-page.css'
})
export class CheckoutPage implements OnInit, OnDestroy {
  private storageService = inject(StorageService);

  public fields = [
    { name: 'username', label: 'Username', type: 'text', validator: [] },
    { name: 'phoneNumber', label: 'Phone', type: 'text', validator: [Validators.pattern(PHONE_NUMBER_PATTERN)] },
    { name: 'address', label: 'Address', type: 'text', validator: [] },
  ];
  public formTitle = "Information of order";
  public buttonLabel = "Process to pay";
  public Validators = Validators;
  public products = signal<Product[]>([]);

  ngOnInit() {
    this.getProductDetails();
  }

  public getProductDetails() {
    const products = this.storageService.getData<Product[]>(STORAGE_KEYS.CHECKOUT_PRODUCT_LIST) || [];
    if (products.length === 0) return;

    this.products.set(products);
  }

  get totalAmount() {
    return this.products().reduce((total, product) => total + product.price! * product.quantityToBuy!, 0);
  }

  handlePayment(formData: Order) {
    console.log('Processing payment with data:', formData);
  }

  ngOnDestroy() {
    this.storageService.removeData(STORAGE_KEYS.CHECKOUT_PRODUCT_LIST);
  }
}

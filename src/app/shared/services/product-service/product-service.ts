import { HttpClient, HttpParams } from '@angular/common/http';
import { effect, inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../../models/product.model';
import { PRODUCT_URL } from '../../constants/url.constants';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private http = inject(HttpClient);

  public categoryId = signal<string>('');
  public products = signal<Product[]>([]);
  public productName = signal<string>('');

  constructor(){
    effect(() => {
      this.getAllProductsByConditions();
    })
  }

  public getAllProductsByConditions() {
    const params = new HttpParams().set('categoryId', this.categoryId()).set('name', this.productName());
    this.http.get<Product[]>(PRODUCT_URL, { params }).subscribe(products => {
      this.products.set(products);
    });
  }
}

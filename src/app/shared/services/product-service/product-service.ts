import { HttpClient, HttpParams } from '@angular/common/http';
import { effect, inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../../models/product.model';
import { PRODUCT_URL } from '../../constants/url.constants';
import { PaginationResponse } from '../../models/pagination-response.model';
import { AuthService } from '../auth-service/auth';
import { ERROR_MESSAGES } from '../../constants/message.constants';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  private currentUser = this.authService.currentUserSignal;
  public categoryId = signal<string>('');
  public products = signal<Product[]>([]);
  public productName = signal<string>('');
  public pagination = signal<PaginationResponse<Product> | null>(null);

  constructor() {
    effect(() => {
      if (!this.currentUser() || this.currentUser()?.role === 'User') {
        this.getAllProductsByConditions();
      }
    })
  }

  public getAllProductsByConditions(page: string = '1', isDeleted: boolean = false) {
    const params = new HttpParams().set('categoryId', this.categoryId()).set('name', this.productName()).set('isDeleted', isDeleted).set('_page', page);
    this.http.get<PaginationResponse<Product>>(PRODUCT_URL, { params }).subscribe({
      next: (res: PaginationResponse<Product>) => {
        if (!res) return;

        this.pagination.set(res);
        this.products.set(res.data);
      }
    });
  }

  public getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${PRODUCT_URL}/${id}`);
  }

  public getProductByNameAndCategory(name: string, categoryName: string): Observable<Product[]> {
    const params = new HttpParams().set('name', name).set('categoryName', categoryName);
    return this.http.get<Product[]>(`${PRODUCT_URL}`, { params });
  }

  public deleteProductById(product: Product): Observable<Product> {
    if (!product) throw new Error(ERROR_MESSAGES.NO_PRODUCT_TO_DELETE);

    product = { ...product, isDeleted: true };

    return this.http.put<Product>(`${PRODUCT_URL}/${product.id}`, product);
  }

  public saveProduct(product: Product, action: string): Observable<Product> {
    if (action === 'update') {
      if (!product) throw new Error(ERROR_MESSAGES.NO_PRODUCT_TO_UPDATE);

      return this.http.put<Product>(`${PRODUCT_URL}/${product.id}`, product);
    }

    return this.http.post<Product>(`${PRODUCT_URL}`, product);
  }
}

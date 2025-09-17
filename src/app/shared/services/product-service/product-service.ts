import { HttpClient, HttpParams } from '@angular/common/http';
import { effect, inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../../models/product.model';
import { PRODUCT_URL } from '../../constants/url.constants';
import { PaginationResponse } from '../../models/pagination-response.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private http = inject(HttpClient);

  public categoryId = signal<string>('');
  public products = signal<Product[]>([]);
  public productName = signal<string>('');
  public pagination = signal<PaginationResponse<Product> | null>(null);
  public currentPage = signal<number>(1);

  constructor(){
    effect(() => {
      this.getAllProductsByConditions();
      this.currentPage.set(1);
    })
  }

  public getAllProductsByConditions(page : string = '1') {
    const params = new HttpParams().set('categoryId', this.categoryId()).set('name', this.productName()).set('_page', page);
    this.http.get<PaginationResponse<Product>>(PRODUCT_URL, { params }).subscribe({
      next: (res: PaginationResponse<Product>) => {
        if(res){
          this.pagination.set(res);
          this.products.set(res.data);
        }
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  public getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${PRODUCT_URL}/${id}`);
  }
}

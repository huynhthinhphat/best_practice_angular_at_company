import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { catchError, forkJoin, Observable, switchMap, throwError } from 'rxjs';
import { Product } from '../../models/product.model';
import { PRODUCT_URL } from '../../constants/url.constants';
import { ERROR_MESSAGES } from '../../constants/message.constants';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private http = inject(HttpClient);

  public productName = signal<string>('');

  public getAllProductsByConditions(selectedCategoryId: string = '', isDeleted: boolean = false): Observable<Product[]> {
    const params = new HttpParams().set('categoryId', selectedCategoryId).set('name', this.productName()).set('isDeleted', isDeleted);
    return this.http.get<Product[]>(PRODUCT_URL, { params });
  }

  public getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${PRODUCT_URL}/${id}`);
  }

  public getProductByNameAndCategory(name: string = '', categoryName: string): Observable<Product[]> {
    const params = new HttpParams().set('name', name).set('categoryName', categoryName);
    return this.http.get<Product[]>(`${PRODUCT_URL}`, { params });
  }

  public deleteProducts(ids: string[]): Observable<Product[]> {
    if (ids.length === 0) return throwError(() => new Error(ERROR_MESSAGES.NOT_FOUND_TO_DELETE));  

    const requests = ids.map(id => {
      return this.http.patch<Product>(`${PRODUCT_URL}/${id}`, { isDeleted: true });
    });

    return forkJoin(requests).pipe(
      catchError(err => throwError(() => err))
    );
  }

  public updateProduct(product: Product): Observable<Product> {
    return this.http.put<Product>(`${PRODUCT_URL}/${product.id}`, {...product});
  }

  public addProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(`${PRODUCT_URL}`, { ...product, isDeleted: false, createdAt: new Date()});
  }
}

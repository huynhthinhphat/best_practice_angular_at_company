import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { effect, inject, Injectable, signal } from '@angular/core';
import { Observable, switchMap, throwError } from 'rxjs';
import { Product } from '../../models/product.model';
import { PRODUCT_URL } from '../../constants/url.constants';
import { AuthService } from '../auth-service/auth';
import { ERROR_MESSAGES } from '../../constants/message.constants';
import { updateProduct } from '../../../pages/product-page/product.action';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private http = inject(HttpClient);

  public categoryId = signal<string>('');
  public productName = signal<string>('');

  public getAllProductsByConditions(isDeleted: boolean = false): Observable<Product[]> {
    const params = new HttpParams().set('categoryId', this.categoryId()).set('name', this.productName()).set('isDeleted', isDeleted);
    return this.http.get<Product[]>(PRODUCT_URL, { params });
  }

  public getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${PRODUCT_URL}/${id}`);
  }

  public getProductByNameAndCategory(name: string, categoryName: string): Observable<Product[]> {
    const params = new HttpParams().set('name', name).set('categoryName', categoryName);
    return this.http.get<Product[]>(`${PRODUCT_URL}`, { params });
  }

  public deleteProductById(product: Product): Observable<Product> {
    if (!product) return throwError(() => new Error(ERROR_MESSAGES.NO_PRODUCT_TO_DELETE));

    product = { ...product, isDeleted: true };

    return this.http.put<Product>(`${PRODUCT_URL}/${product.id}`, product);
  }

  public saveProduct(oldProduct: Product | null, product: Product): Observable<HttpResponse<Product>> {
    if (!product) return throwError(() => new Error(ERROR_MESSAGES.NO_PRODUCT_TO_SAVE));

    return this.getProductByNameAndCategory(product.name!, product.categoryName!).pipe(
      switchMap((res: Product[]) => {
        const now = new Date();
        const isExisted = res.length > 0;
        const isUpdate = !!product.id;
        const hasNameOrCategoryChanged = oldProduct && (oldProduct.name !== product.name || oldProduct.categoryName !== product.categoryName);

        if ((isUpdate && hasNameOrCategoryChanged && isExisted) || (!isUpdate && isExisted)) {
          return throwError(() => new Error(ERROR_MESSAGES.EXISTED_PRODUCT));
        }

        if(isUpdate){
          return this.http.put<Product>(`${PRODUCT_URL}/${product.id}`, {...product, updatedAt: now}, { observe: 'response' });
        }

        const newProduct: Product = { ...product, createdAt: now };
        delete newProduct.id;
        return this.http.post<Product>(`${PRODUCT_URL}`, newProduct, { observe: 'response' });       
      })
    )
  }
}

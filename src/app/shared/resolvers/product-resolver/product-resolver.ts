import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { ProductService } from '../../services/product-service/product-service';
import { catchError, EMPTY } from 'rxjs';
import { Product } from '../../models/product.model';

export const productResolver: ResolveFn<Product> = (route) => {
  const router = inject(Router);
  const productService = inject(ProductService);
  const productId = route.params['id'];

  return productService.getProductById(productId).pipe(
    catchError(() => {
      router.navigate(['/not-found']);
      return EMPTY;
    })
  );
};

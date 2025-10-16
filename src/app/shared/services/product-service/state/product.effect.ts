import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { addProduct, addProductFailure, addProductSuccess, deleteProducts, deleteProductsFailure, deleteProductsSuccess, loadProducts, loadProductSuccess, updateProduct, updateProductFailure, updateProductSuccess } from "./product.action";
import { catchError, map, of, switchMap, tap } from "rxjs";
import { ProductService } from "../product-service";

@Injectable()
export class ProductEffects {
    private actions$ = inject(Actions);
    private productService = inject(ProductService);

    loadProduct$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(loadProducts),
            switchMap(() =>
                this.productService.getAllProductsByConditions()
                    .pipe(
                        map(products => loadProductSuccess({ products: products })),
                    )
            )
        )
    })

    deleteProduts$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(deleteProducts),
            switchMap(({ ids }) =>
                this.productService.deleteProducts(ids)
                    .pipe(
                        map(() => deleteProductsSuccess({ ids: ids })),
                        catchError(error => of(deleteProductsFailure({ error : error})))
                    )
            )
        )
    })

    updatedProduct$ = createEffect(() =>
        this.actions$.pipe(
            ofType(updateProduct),
            tap(action => console.log('updateProduct action dispatched:', action)),
            switchMap(({ product }) =>
                this.productService.updateProduct(product).pipe(
                    map(product => updateProductSuccess({ product })),
                    catchError(error => {
                        console.log('Caught error in effect:', error);
                        return of(updateProductFailure({ error: error.message || 'Unknown error' }));
                    })
                )
            )
        )
    );

    addProduct$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(addProduct),
            switchMap(({ product }) => 
                this.productService.addProduct(product)
                    .pipe(
                        map(product => addProductSuccess({ product: product })),
                        catchError(error => of(addProductFailure({ error: error })))
                )
            )
        )
    })
}
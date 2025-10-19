import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { addProduct, addProductFailure, addProductSuccess, deleteProductFailure, deleteProducts, deleteProductsSuccess, loadProductFailure, loadProducts, loadProductSuccess, updateProduct, updateProductFailure, updateProductSuccess } from "./product.action";
import { catchError, delay, map, mergeMap, of, retryWhen, switchMap, tap, throwError } from "rxjs";
import { ProductService } from "../product-service";
import { Store } from "@ngrx/store";
import { selectAllCategories } from "../../category-service/state/category.selector";
import { withLatestFrom } from "rxjs";
import { ToastrService } from "ngx-toastr";
import { SUCCESS_MESSAGES } from "../../../constants/message.constants";
import { selectErrorProduct } from "./product.selector";

@Injectable()
export class ProductEffects {
    private actions$ = inject(Actions);
    private productService = inject(ProductService);
    private toastr = inject(ToastrService);
    private store = inject(Store);

    loadProduct$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(loadProducts),
            switchMap(() =>
                this.productService.getAllProductsByConditions()
                    .pipe(
                        retryWhen(errors => 
                            errors.pipe(
                                mergeMap((error, attempt) => {
                                    if (attempt >= 3) {
                                        return throwError(() => error)
                                    }
                                    return of(error).pipe(delay(Math.pow(2, attempt) * 1000))
                                })
                            )
                        ),
                        map(products => loadProductSuccess({ products: products })),
                        catchError((error: Error) => of(loadProductFailure({ error: error.message })))
                    )
            )
        )
    })

    deleteProduts$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(deleteProducts),
            switchMap(({ ids }) =>
                this.productService.deleteProducts(ids).pipe(
                    map(() => {
                        this.toastr.success(SUCCESS_MESSAGES.DELETE);
                        return deleteProductsSuccess({ ids: ids })
                    }),
                    catchError((error: Error) => of(deleteProductFailure({ error: error.message })))
                )
            )
        )
    })

    updatedProduct$ = createEffect(() =>
        this.actions$.pipe(
            ofType(updateProduct),
            withLatestFrom(this.store.select(selectAllCategories)),
            switchMap(([{ prevProduct, newData }, categories]) =>
                this.productService.doesProductExist(prevProduct, newData).pipe(
                    switchMap((product) => {
                        const category = categories?.find(category => category.id === product.categoryId);

                        return this.productService.updateProduct(product).pipe(
                            map(updatedProduct => {
                                this.toastr.success(SUCCESS_MESSAGES.UPDATE);
                                return updateProductSuccess({ product: { ...updatedProduct, categoryName: category?.name } })
                            }),
                            catchError((error: Error) => of(updateProductFailure({ error: error.message })))
                        )
                    }),
                    catchError((error: Error) => of(updateProductFailure({ error: error.message }))
                    )
                )
            )
        )
    )

    addProduct$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(addProduct),
            withLatestFrom(this.store.select(selectAllCategories)),
            switchMap(([{ product }, categories]) =>
                this.productService.doesProductExist(null, product).pipe(
                    switchMap((product) => {
                        const category = categories?.find(category => category.id === product.categoryId);

                        return this.productService.addProduct(product).pipe(
                            map(newProduct => {
                                this.toastr.success(SUCCESS_MESSAGES.ADD);
                                return addProductSuccess({ product: { ...newProduct, categoryName: category?.name } })
                            }),
                            catchError((error: Error) => of(addProductFailure({ error: error.message })))
                        )
                    }),
                    catchError((error: Error) => of(addProductFailure({ error: error.message }))
                    )
                )
            )
        )
    })

    showErrorDialog$ = createEffect(() =>
        this.actions$.pipe(
            ofType(updateProductFailure, deleteProductFailure, addProductFailure),
            withLatestFrom(this.store.select(selectErrorProduct)),
            tap(([_, error]) => {
                this.toastr.error(error!);
            })
        ),
        { dispatch: false }
    );
}
import { inject } from "@angular/core";
import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, of, switchMap, tap, withLatestFrom } from "rxjs";
import { CategoryService } from "../category-service";
import { addCategory, addCategoryFailure, addCategorySuccess, deleteCategories, deleteCategoriesFailure, deleteCategoriesSuccess, loadCategories, loadCategoriesSuccess, updateCategory, updateCategoryFailure, updateCategorySuccess } from "./category.action";
import { ToastrService } from "ngx-toastr";
import { SUCCESS_MESSAGES } from "../../../constants/message.constants";
import { Store } from "@ngrx/store";
import { selectErrorCategory } from "./category.selector";

@Injectable()
export class CategoryEffect {
    private actions$ = inject(Actions);
    private categoryService = inject(CategoryService);
    private toastr = inject(ToastrService);
    private store = inject(Store);

    loadCategories$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(loadCategories),
            switchMap(() =>
                this.categoryService.getAllCategoriesByConditions()
                    .pipe(
                        map(categories => loadCategoriesSuccess({ categories: categories })
                        )
                    )
            )
        )
    })

    deleteCategories$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(deleteCategories),
            switchMap(({ ids }) =>
                this.categoryService.deleteCategories(ids).pipe(
                    map(() => {
                        this.toastr.success(SUCCESS_MESSAGES.DELETE);
                        return deleteCategoriesSuccess({ ids: ids })
                    }),
                    catchError((error: Error) => of(deleteCategoriesFailure({ error: error.message })))
                )
            )
        )
    })

    updatedCategory$ = createEffect(() =>
        this.actions$.pipe(
            ofType(updateCategory),
            switchMap(({ prevCategory, newData }) =>
                this.categoryService.checkCategoryExist(prevCategory, newData).pipe(
                    switchMap((category) => {
                        category.name = category.name?.trim();
                        return this.categoryService.updateCategory(category).pipe(
                            map(updatedCategory => {
                                this.toastr.success(SUCCESS_MESSAGES.UPDATE);
                                return updateCategorySuccess({ category: { ...updatedCategory } })
                            }),
                            catchError((error: Error) => of(updateCategoryFailure({ error: error.message })))
                        )
                    }),
                    catchError((error: Error) => of(updateCategoryFailure({ error: error.message }))
                    )
                )
            )
        )
    )

    addCategory$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(addCategory),
            switchMap(({ category }) =>
                this.categoryService.checkCategoryExist(null, category).pipe(
                    switchMap((category) => {
                        category.name = category.name?.trim();
                        return this.categoryService.addCategory(category).pipe(
                            map(newCategory => {
                                this.toastr.success(SUCCESS_MESSAGES.ADD);
                                return addCategorySuccess({ category: { ...newCategory } })
                            }),
                            catchError((error: Error) => of(addCategoryFailure({ error: error.message })))
                        )
                    }),
                    catchError((error: Error) => of(addCategoryFailure({ error: error.message }))
                    )
                )
            )
        )
    })

    showErrorDialog$ = createEffect(() =>
        this.actions$.pipe(
            ofType(updateCategoryFailure, addCategoryFailure, deleteCategoriesFailure),
            withLatestFrom(this.store.select(selectErrorCategory)),
            tap(([_, error]) => {
                this.toastr.error(error!);
            })
        ),
        { dispatch: false }
    );
}
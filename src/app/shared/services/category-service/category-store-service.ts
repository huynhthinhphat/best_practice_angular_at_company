import { inject, Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { AppState } from "../../../state/app.state";
import { CategoryService } from "./category-service";
import { toSignal } from "@angular/core/rxjs-interop";
import { getAllCategories } from "./state/category.selector";
import { tap } from "rxjs";
import { setCategories } from "./state/category.action";

@Injectable({
  providedIn: 'root'
})

export class CategoryStoreService{
    private store = inject(Store<AppState>);
    private categoryService = inject(CategoryService);

    public categories = toSignal(this.store.select(getAllCategories), { initialValue: [] });

    public setCategories() {
        this.categoryService.getAllCategoriesByConditions()
            .pipe(
            tap(categories => this.store.dispatch(setCategories({categories: categories})))
        ).subscribe()
    }
}
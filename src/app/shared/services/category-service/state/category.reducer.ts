import { createReducer, on } from "@ngrx/store";
import { setCategories } from "./category.action";
import { categoryAdapter, initialCategoryState } from "./category.state";

export const categoryReducer = createReducer(
    initialCategoryState,

    on(setCategories, (state, { categories }) =>
        categoryAdapter.setAll(categories, state)
    )
)
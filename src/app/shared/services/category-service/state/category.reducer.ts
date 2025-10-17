import { createReducer, on } from "@ngrx/store";
import { addCategoryFailure, addCategorySuccess, deleteCategoriesFailure, deleteCategoriesSuccess, loadCategoriesSuccess, updateCategoryFailure, updateCategorySuccess } from "./category.action";
import { categoryAdapter, initialCategoryState } from "./category.state";

export const categoryReducer = createReducer(
    initialCategoryState,

    on(loadCategoriesSuccess, (state, { categories }) =>
        categoryAdapter.setAll(categories, state)
    ),

    on(addCategorySuccess, (state, { category }) =>
        categoryAdapter.addOne(category, { ...state, isOpenDialog: false, error: null })
    ),

    on(updateCategorySuccess, (state, { category }) =>
        categoryAdapter.updateOne({ id: category.id!, changes: { ...category } }, { ...state, isOpenDialog: false, error: null })
    ),

    on(deleteCategoriesSuccess, (state, { ids }) =>
        categoryAdapter.removeMany(ids, { ...state, isOpenDialog: false, error: null })
    ),

    on(addCategoryFailure, updateCategoryFailure, deleteCategoriesFailure, (state, { error }) =>
        ({ ...state, isOpenDialog: true, error: error })
    )
)
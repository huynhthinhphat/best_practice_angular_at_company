import { createFeatureSelector, createSelector } from "@ngrx/store";
import { categoryAdapter, CategoryState } from "./category.state";

export const categorySelector = createFeatureSelector<CategoryState>('category');
export const getSelectors = categoryAdapter.getSelectors();

export const selectAllCategories = createSelector(
    categorySelector,
    (state) => [...getSelectors.selectAll(state)]
)

export const selectErrorCategory = createSelector(
  categorySelector,
  (state) => state.error
)

export const selectIsOpenDialog = createSelector(
  categorySelector,
  (state) => state.isOpenDialog
)
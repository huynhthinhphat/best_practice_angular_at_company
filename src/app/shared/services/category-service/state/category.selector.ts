import { createFeatureSelector, createSelector } from "@ngrx/store";
import { categoryAdapter, CategoryState } from "./category.state";

export const categorySelector = createFeatureSelector<CategoryState>('category');
export const getSelectors = categoryAdapter.getSelectors();

export const getAllCategories = createSelector(
    categorySelector,
    (state) => getSelectors.selectAll(state)
)
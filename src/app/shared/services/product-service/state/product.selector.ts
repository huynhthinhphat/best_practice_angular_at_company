import { createFeatureSelector, createSelector } from "@ngrx/store";
import { productAdapter, ProductState } from "./product.state";

export const productSelector = createFeatureSelector<ProductState>('product');

export const getSelectors = productAdapter.getSelectors();

export const selectAllProducts = createSelector(
  productSelector,
  (state) => [...getSelectors.selectAll(state)]
) 

export const selectProductsByCondition = createSelector(
  productSelector,
  (state: ProductState, props: { startIndex: number; endIndex: number }) => getSelectors.selectAll(state).slice(props.startIndex, props.endIndex)
) 
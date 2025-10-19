import { createFeatureSelector, createSelector } from "@ngrx/store";
import { productAdapter, ProductState } from "./product.state";

export const productSelector = createFeatureSelector<ProductState>('product');

export const getSelectors = productAdapter.getSelectors();

export const selectProductsByConditions = createSelector(
  productSelector,
  (state: ProductState, props: { productName: string; categoryName: string, startIndex: number; endIndex: number | undefined }) => {
    return getSelectors.selectAll(state)
      .filter(product =>
        product.name?.toLocaleLowerCase().trim().includes(props.productName.toLocaleLowerCase().trim()) &&
        product.categoryName?.toLocaleLowerCase().trim().includes(props.categoryName.toLocaleLowerCase().trim())
      )
      .slice(props.startIndex, props.endIndex)
  }
)



export const selectErrorProduct = createSelector(
  productSelector,
  (state) => state.error
)

export const selectIsOpenDialog = createSelector(
  productSelector,
  (state) => state.isOpenDialog
)
import { createAction, props } from "@ngrx/store";
import { Product } from "../../../models/product.model";
import { PRODUCT_ACTIONS_TYPES } from "../../../constants/actions-type.constants";

export const loadProducts = createAction(PRODUCT_ACTIONS_TYPES.LOAD);
export const loadProductSuccess = createAction(PRODUCT_ACTIONS_TYPES.LOAD_SUCCESS, props<{ products: Product[] }>());
export const loadProductFailure = createAction(PRODUCT_ACTIONS_TYPES.LOAD_FAILURE, props<{ error: string }>());

export const addProduct = createAction(PRODUCT_ACTIONS_TYPES.ADD, props<{ product: Product }>());
export const addProductSuccess = createAction(PRODUCT_ACTIONS_TYPES.ADD_SUCCESS, props<{ product: Product }>());
export const addProductFailure = createAction(PRODUCT_ACTIONS_TYPES.ADD_FAILURE, props<{ error: string }>());

export const updateProduct = createAction(PRODUCT_ACTIONS_TYPES.UPDATE, props<{ prevProduct: Product, newData: Product }>());
export const updateProductSuccess = createAction(PRODUCT_ACTIONS_TYPES.UPDATE_SUCCESS, props<{ product: Product }>());
export const updateProductFailure = createAction(PRODUCT_ACTIONS_TYPES.UPDATE_FAILURE, props<{ error: string }>());

export const deleteProducts = createAction(PRODUCT_ACTIONS_TYPES.DELETE, props<{ ids: string[] }>())
export const deleteProductsSuccess = createAction(PRODUCT_ACTIONS_TYPES.DELETE_SUCCESS, props<{ ids: string[] }>())
export const deleteProductFailure = createAction(PRODUCT_ACTIONS_TYPES.DELETE_FAILURE, props<{ error: string }>());

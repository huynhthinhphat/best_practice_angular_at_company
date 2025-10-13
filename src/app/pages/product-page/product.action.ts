import { createAction, props } from "@ngrx/store";
import { Product } from "../../shared/models/product.model";

export const loadProducts = createAction('[Product] Load Products', props<{ products: Product[] }>());
export const addProduct = createAction('[Product] Add A New Product', props<{ product: Product }>());
export const updateProduct = createAction('[Product] Update Product', props<{ product: Product }>());
export const deleteProducts = createAction('[Product] Delete Products', props <{ ids: string[] }>())
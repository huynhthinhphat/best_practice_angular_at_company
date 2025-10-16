import { createEntityAdapter, EntityState } from "@ngrx/entity";
import { Product } from "../../../models/product.model";

export interface ProductState extends EntityState<Product> { 
    errors: string | null;
};
export const productAdapter = createEntityAdapter<Product>();
export const initialProductState : ProductState = productAdapter.getInitialState({
    errors: null
})
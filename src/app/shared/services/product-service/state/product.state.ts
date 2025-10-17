import { createEntityAdapter, EntityState } from "@ngrx/entity";
import { Product } from "../../../models/product.model";

export interface ProductState extends EntityState<Product> {
    isOpenDialog : boolean,
    error: string | null
};
export const productAdapter = createEntityAdapter<Product>();
export const initialProductState: ProductState = productAdapter.getInitialState({
    isOpenDialog: true,
    error: null
})
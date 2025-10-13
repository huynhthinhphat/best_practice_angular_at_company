import { Product } from "../../shared/models/product.model";
import { createEntityAdapter, EntityState } from "@ngrx/entity";

export interface ProductState extends EntityState<Product> { };
export const productAdapter = createEntityAdapter<Product>();
import { createEntityAdapter, EntityState } from "@ngrx/entity";
import { Cart } from "../../shared/models/cart.model";

export interface CartState extends EntityState<Cart> { };
export const cartAdapter = createEntityAdapter<Cart>();
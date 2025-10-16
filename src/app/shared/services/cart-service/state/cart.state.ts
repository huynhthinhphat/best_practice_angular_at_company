import { createEntityAdapter, EntityState } from "@ngrx/entity";
import { Cart } from "../../../models/cart.model";

export interface CartState extends EntityState<Cart> { };
export const cartAdapter = createEntityAdapter<Cart>();
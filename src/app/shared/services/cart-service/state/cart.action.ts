import { createAction, props } from "@ngrx/store";
import { CartItem } from "../../../models/cart-item.model";

export const loadCarts = createAction('[Cart] Load Carts', props<{ cartItems: CartItem[] }>());
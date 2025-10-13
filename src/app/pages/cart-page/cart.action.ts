import { createAction, props } from "@ngrx/store";
import { CartItem } from "../../shared/models/cart-item.model";

export const loadCarts = createAction('[Cart] Load Carts', props<{ cartItems: CartItem[] }>());
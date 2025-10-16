import { createReducer, on } from "@ngrx/store";
import { cartAdapter } from "./cart.state";
import { loadCarts } from "./cart.action";

export const cartReducer = createReducer(
    cartAdapter.getInitialState(),

    on(loadCarts, (state, { cartItems }) =>
        cartAdapter.setAll(cartItems, state)
    ),
)
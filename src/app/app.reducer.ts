import { ActionReducerMap } from "@ngrx/store";
import { AppState } from "./app.state";
import { productReducer } from "./pages/product-page/product.reducer";
import { cartReducer } from "./pages/cart-page/cart.reducer";
import { userReducer } from "./pages/user-page/user.reducer";

export const appReducers: ActionReducerMap<AppState> = {
    product: productReducer,
    cart: cartReducer,
    user: userReducer
}
import { ActionReducerMap } from "@ngrx/store";
import { AppState } from "./app.state";
import { categoryReducer } from "../shared/services/category-service/state/category.reducer";
import { productReducer } from "../shared/services/product-service/state/product.reducer";
import { userReducer } from "../shared/services/user-service/state/user.reducer";
import { cartReducer } from "../shared/services/cart-service/state/cart.reducer";

export const appReducers: ActionReducerMap<AppState> = {
    product: productReducer,
    cart: cartReducer,
    user: userReducer,
    category: categoryReducer
}
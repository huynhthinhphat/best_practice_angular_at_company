import { CartState } from "./pages/cart-page/cart.state";
import { ProductState } from "./pages/product-page/product.state";
import { UserState } from "./pages/user-page/user.state";

export interface AppState {
    product: ProductState,
    cart: CartState,
    user: UserState
}
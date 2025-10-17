import { CartState } from "../shared/services/cart-service/state/cart.state";
import { CategoryState } from "../shared/services/category-service/state/category.state";
import { ProductState } from "../shared/services/product-service/state/product.state";
import { UserState } from "../shared/services/user-service/state/user.state";

export interface AppState {
    product: ProductState,
    cart: CartState,
    user: UserState,
    category: CategoryState,
}
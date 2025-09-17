import { Product } from "./product.model";

export interface CartItem {
    id?: string;
    cartId?: string;
    product?: Product;
    quantity?: number;
}
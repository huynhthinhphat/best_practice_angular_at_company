import { Product } from "./product.model";

export interface OrderDetail{
    id?: string;
    orderId?: string;
    product?: Product;
    quantity?: number;
    totalPrice?: number
}

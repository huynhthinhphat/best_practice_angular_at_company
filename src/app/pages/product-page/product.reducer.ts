import { createReducer, on } from "@ngrx/store";
import { productAdapter } from "./product.state";
import { addProduct, deleteProducts, loadProducts, updateProduct } from "./product.action";

export const productReducer = createReducer(
    productAdapter.getInitialState(),

    on(loadProducts, (state, { products }) =>
        productAdapter.setAll(products, state)
    ),
    on(addProduct, (state, { product }) =>
        productAdapter.addOne(product, state)
    ),
    on(updateProduct, (state, { product }) =>
        productAdapter.updateOne({ id: product.id || '', changes: product }, state),
    ),
    on(deleteProducts, (state, { ids }) =>
        productAdapter.removeMany(ids, state)
    )
)
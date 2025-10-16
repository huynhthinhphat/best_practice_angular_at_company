import { createReducer, on } from "@ngrx/store";
import { initialProductState, productAdapter } from "./product.state";
import { addProductFailure, addProductSuccess, deleteProductsFailure, deleteProductsSuccess, loadProductSuccess, updateProductFailure, updateProductSuccess } from "./product.action";

export const productReducer = createReducer(
    initialProductState,

    on(loadProductSuccess, (state, { products }) =>
        productAdapter.setAll(products, state)
    ),

    on(addProductSuccess, (state, { product }) =>
        productAdapter.addOne(product, state)
    ),

    on(updateProductSuccess, (state, { product }) =>
        productAdapter.updateOne({ id: product.id!, changes: {...product} }, state),
    ),

    on(deleteProductsSuccess, (state, { ids }) =>{
        return productAdapter.removeMany(ids, state)
    }),

    on(addProductFailure, updateProductFailure, deleteProductsFailure, (state, { error }) => {
        console.log('Error in reducer:', error);
        return { ...state, error };
    })
)
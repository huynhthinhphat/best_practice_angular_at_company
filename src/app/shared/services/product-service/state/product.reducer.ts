import { createReducer, on } from "@ngrx/store";
import { initialProductState, productAdapter } from "./product.state";
import { addProductFailure, addProductSuccess, deleteProductFailure, deleteProductsSuccess, loadProductSuccess, updateProductFailure, updateProductSuccess } from "./product.action";

export const productReducer = createReducer(
    initialProductState,

    on(loadProductSuccess, (state, { products }) =>
        productAdapter.setAll(products, { ...state })
    ),

    on(addProductSuccess, (state, { product }) =>
        productAdapter.addOne(product, { ...state, isOpenDialog: false, error: null })
    ),

    on(updateProductSuccess, (state, { product }) =>
        productAdapter.updateOne({ id: product.id!, changes: { ...product } }, { ...state, isOpenDialog: false, error: null })
    ),

    on(deleteProductsSuccess, (state, { ids }) =>
        productAdapter.removeMany(ids, { ...state, isOpenDialog: false, error: null })
    ),

    on(addProductFailure, updateProductFailure, deleteProductFailure, (state, { error }) =>
        ({ ...state, isOpenDialog: true, error: error })
    )
);
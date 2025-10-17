export enum PRODUCT_ACTIONS_TYPES{
    LOAD = '[Product] Load Products',
    LOAD_SUCCESS = '[Product] Load Products Success',

    ADD = '[Product] Add Product',
    ADD_SUCCESS = '[Product] Add Product Success',
    ADD_FAILURE = '[Product] Add Product Failure',

    UPDATE = '[Product] Update Product',
    UPDATE_SUCCESS = '[Product] Update Product Success',
    UPDATE_FAILURE = '[Product] Update Product Failure',

    DELETE = '[Product] Delete Products',
    DELETE_SUCCESS = '[Product] Delete Products Success',
    DELETE_FAILURE = '[Product] Delete Product Failure'
}

export enum CATEGORY_ACTIONS_TYPES{
    LOAD = '[Category] Load Categories',
    LOAD_SUCCESS = '[Category] Load Categories Success',

    ADD = '[Category] Add Category',
    ADD_SUCCESS = '[Category] Add Category Success',
    ADD_FAILURE = '[Category] Add Category Failure',

    UPDATE = '[Category] Update Category',
    UPDATE_SUCCESS = '[Category] Update Category Success',
    UPDATE_FAILURE = '[Category] Update Category Failure',

    DELETE = '[Category] Delete Categories',
    DELETE_SUCCESS = '[Category] Delete Categories Success',
    DELETE_FAILURE = '[Category] Delete Category Failure'
}

export enum UI_ACTIONS_TYPES{
    SET = '[UI] Set Global Error',
    CLEAR = '[UI] Clear Global Error',
    OPEN_DIALOG = '[UI] Open Dialog',
    CLOSE_DIALOG = '[UI] Close Dialog'  
}
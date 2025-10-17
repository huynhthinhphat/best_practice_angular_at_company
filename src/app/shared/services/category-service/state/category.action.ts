import { createAction, props } from "@ngrx/store";
import { CATEGORY_ACTIONS_TYPES } from "../../../constants/actions-type.constants";
import { Category } from "../../../models/category.model";

export const loadCategories = createAction(CATEGORY_ACTIONS_TYPES.LOAD);
export const loadCategoriesSuccess = createAction(CATEGORY_ACTIONS_TYPES.LOAD_SUCCESS, props<{ categories: Category[] }>());

export const addCategory = createAction(CATEGORY_ACTIONS_TYPES.ADD, props<{ category: Category }>());
export const addCategorySuccess = createAction(CATEGORY_ACTIONS_TYPES.ADD_SUCCESS, props<{ category: Category }>());
export const addCategoryFailure = createAction(CATEGORY_ACTIONS_TYPES.ADD_FAILURE, props<{ error: string }>());

export const updateCategory = createAction(CATEGORY_ACTIONS_TYPES.UPDATE, props<{ prevCategory: Category, newData: Category }>());
export const updateCategorySuccess = createAction(CATEGORY_ACTIONS_TYPES.UPDATE_SUCCESS, props<{ category: Category }>());
export const updateCategoryFailure = createAction(CATEGORY_ACTIONS_TYPES.UPDATE_FAILURE, props<{ error: string }>());

export const deleteCategories = createAction(CATEGORY_ACTIONS_TYPES.DELETE, props<{ ids: string[] }>())
export const deleteCategoriesSuccess = createAction(CATEGORY_ACTIONS_TYPES.DELETE_SUCCESS, props<{ ids: string[] }>())
export const deleteCategoriesFailure = createAction(CATEGORY_ACTIONS_TYPES.DELETE_FAILURE, props<{ error: string }>());
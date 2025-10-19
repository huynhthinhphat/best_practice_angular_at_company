import { createEntityAdapter, EntityState } from "@ngrx/entity";
import { Category } from "../../../models/category.model";

export interface CategoryState extends EntityState<Category> {
    isOpenDialog: boolean,
    error: string | null,
    isLoading: boolean
};
export const categoryAdapter = createEntityAdapter<Category>();
export const initialCategoryState: CategoryState = categoryAdapter.getInitialState({
    isOpenDialog: true,
    error: null,
    isLoading: false
})
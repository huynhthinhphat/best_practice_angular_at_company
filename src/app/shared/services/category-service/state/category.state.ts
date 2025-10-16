import { createEntityAdapter, EntityState } from "@ngrx/entity";
import { Category } from "../../../models/category.model";

export interface CategoryState extends EntityState<Category>{ }
export const categoryAdapter = createEntityAdapter<Category>();
export const initialCategoryState: CategoryState = categoryAdapter.getInitialState();
import { createAction, props } from "@ngrx/store";
import { Category } from "../../../models/category.model";

export const setCategories = createAction('[Category] Set Categories', props<{ categories: Category[] }>())
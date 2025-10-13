import { createAction, props } from "@ngrx/store";
import { User } from "../../shared/models/user.model";

export const setCurrentUser = createAction('[User] Set Current User', props<{ user: User | null }>());
export const addLoggedInUserToList = createAction('[User] Add Logged In User To List', props<{ user: User }>());
export const removeLoggedInUserFromList = createAction('[User] Remove Logged In User To List', props<{ id: string }>());
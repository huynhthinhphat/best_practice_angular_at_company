import { createAction, props } from "@ngrx/store";
import { User } from "../../../models/user.model";
import { USER_ACTIONS_TYPES } from "../../../constants/actions-type.constants";

export const onLogin = createAction(USER_ACTIONS_TYPES.LOGIN, props<{ user: User }>());

export const loadUser = createAction(USER_ACTIONS_TYPES.LOAD);
export const loadUserSuccess = createAction(USER_ACTIONS_TYPES.LOAD_SUCCESS, props<{ user: User }>());
export const loadUserFailure = createAction(USER_ACTIONS_TYPES.LOAD_FAILD, props<{ error: string }>());

export const removeLoggedInUser = createAction(USER_ACTIONS_TYPES.REMOVE);
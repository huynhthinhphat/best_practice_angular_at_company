import { createFeatureSelector, createSelector } from "@ngrx/store";
import { userAdapter, UserState } from "./user.state";

export const userSelector = createFeatureSelector<UserState>('user');
export const getSelectors = userAdapter.getSelectors();

export const selectUserEntities = createSelector(
    userSelector,
    getSelectors.selectEntities
)

export const selectUser = createSelector(
    userSelector,
    (state) => state.user
)

export const selectAllUsers = createSelector(
    userSelector,
    (state: UserState) => getSelectors.selectAll(state)
)

export const selectUserErrorInfo = createSelector(
    userSelector,
    (state) => ({ message: state.error, isLoggedIn: state.isLoggedIn})
)
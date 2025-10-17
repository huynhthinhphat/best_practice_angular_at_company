import { createFeatureSelector, createSelector } from "@ngrx/store";
import { userAdapter, UserState } from "./user.state";

export const userSelector = createFeatureSelector<UserState>('user');

export const selectCurrentUser = createSelector(
    userSelector,
    (state) => state.currentUser
)

export const selectAllUsers = createSelector(
    userSelector,
    (state: UserState) => userAdapter.getSelectors().selectAll(state)
)
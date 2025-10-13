import { createFeatureSelector, createSelector } from "@ngrx/store";
import { userAdapter, UserState } from "./user.state";

export const userSelector = createFeatureSelector<UserState>('user');

export const getCurrentUser = createSelector(
    userSelector,
    (state) => state.currentUser
)

export const getAllUsers = createSelector(
    userSelector,
    (state: UserState) => userAdapter.getSelectors().selectAll(state)
)
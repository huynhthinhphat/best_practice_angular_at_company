import { createEntityAdapter, EntityState } from "@ngrx/entity";
import { User } from "../../../models/user.model";

export interface UserState extends EntityState<User> {
    currentUser: User | null;
}

export const userAdapter = createEntityAdapter<User>();

export const initialUserState: UserState = userAdapter.getInitialState({
    currentUser: null
});
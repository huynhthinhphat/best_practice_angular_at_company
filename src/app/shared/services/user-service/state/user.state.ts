import { createEntityAdapter, EntityState } from "@ngrx/entity";
import { User } from "../../../models/user.model";

export interface UserState extends EntityState<User> {
    error: string | null,
    isLoggedIn: boolean,
    isLoading: boolean,
    user: User | null,
}
export const userAdapter = createEntityAdapter<User>();
export const initialUserState: UserState = userAdapter.getInitialState({
    error: null,
    isLoggedIn: false,
    isLoading: false,
    user: null
});
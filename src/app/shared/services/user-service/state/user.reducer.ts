import { createReducer, on } from "@ngrx/store";
import { initialUserState } from "./user.state";
import { removeLoggedInUser, loadUserSuccess, loadUserFailure, loadUser, onLogin } from "./user.action";

export const userReducer = createReducer(
    initialUserState,

    on(onLogin, (state) => ({
        ...state,
        isLoading: true,
        isLoggedIn: false,
        error: null
    })),

    on(loadUserSuccess, (state, { user }) => ({
        ...state,
        user,
        isLoading: false, 
        isLoggedIn: true, 
        error: null 
    })),    

    on(loadUserFailure, (state, { error }) => ({
        ...state,
        isLoggedIn: false,
        error: error
    })),

    on(removeLoggedInUser, () => initialUserState)
)
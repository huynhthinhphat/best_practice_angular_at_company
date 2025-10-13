import { createReducer, on } from "@ngrx/store";
import { initialUserState, userAdapter } from "./user.state";
import { addLoggedInUserToList, removeLoggedInUserFromList, setCurrentUser } from "./user.action";

export const userReducer = createReducer(
    initialUserState,

    on(setCurrentUser, (state, { user }) => ({
        ...state,
        currentUser: user
    })),

    on(addLoggedInUserToList, (state, { user }) =>
        userAdapter.addOne(user, state)
    ),

    on(removeLoggedInUserFromList, (state, { id }) =>
        userAdapter.removeOne(id, state)
    )
)
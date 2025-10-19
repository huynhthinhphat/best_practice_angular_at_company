import { inject } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { UserService } from "../user-service";
import { loadUser, loadUserFailure, loadUserSuccess, onLogin } from "./user.action";
import { catchError, EMPTY, map, of, switchMap, tap } from "rxjs";
import { StorageService } from "../../storage-service/storage-service";
import { User } from "../../../models/user.model";
import { STORAGE_KEYS } from "../../../constants/storage.constants";
import { Router } from "@angular/router";

export class UserEffects {
    private actions$ = inject(Actions);
    private userService = inject(UserService);
    private storageService = inject(StorageService);
    private router = inject(Router);

    onLogin$ = createEffect(() =>
        this.actions$.pipe(
            ofType(onLogin),
            switchMap(({ user }) => {
                return this.userService.onLogin(user).pipe(
                    map(user => {
                        const { password, ...userWithoutPassword } = user;
                        const { role, ...userWithoutRole } = userWithoutPassword;
                        this.storageService.saveData<User>(STORAGE_KEYS.USER, userWithoutRole);

                        return loadUserSuccess({ user: userWithoutPassword })
                    }),
                    catchError((error: Error) => {
                        return of(loadUserFailure({ error: error.message }));
                    })
                )
            }
            )
        )
    )

    loadUser$ = createEffect(() =>
        this.actions$.pipe(
            ofType(loadUser),
            switchMap(() => {
                const user = this.storageService.getData<User>(STORAGE_KEYS.USER);

                if (!user || !user.id) {
                    this.router.navigate(['home']);
                    return EMPTY;
                }

                return this.userService.getUserById(user.id).pipe(
                    map((user) => {
                        const { password, ...userWithoutPassword } = user!;
                        return loadUserSuccess({ user: userWithoutPassword! });
                    }),
                    tap(({ user }) => {
                        if (user.role === 'Admin') {
                            // this.router.navigate(['/admin/users']);
                        } else {
                            this.router.navigate(['home']);
                        }
                    }),
                    catchError(() => {
                        this.router.navigate(['home']);
                        return EMPTY;
                    })
                )
            })
        )
    )
}
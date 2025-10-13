import { HttpClient, HttpParams } from '@angular/common/http';
import { effect, inject, Injectable, signal } from '@angular/core';
import { catchError, map, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { User } from '../../models/user.model';
import { USER_URL } from '../../constants/url.constants';
import { ERROR_MESSAGES } from '../../constants/message.constants';
import { STORAGE_KEYS } from '../../constants/storage.constants';
import { StorageService } from '../storage-service/storage-service';
import { Store } from '@ngrx/store';
import { AppState } from '../../../app.state';
import { setCurrentUser } from '../../../pages/user-page/user.action';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private store = inject(Store<AppState>);
  private storageService = inject(StorageService);

  public userId = signal<string>('');

  constructor() {
    effect(() => {
      this.trackUserSession();
    })
  }

  public addAccount(user: User): Observable<User> {
    const params = new HttpParams().set('username', user.username!);
    return this.http.get<User[]>(USER_URL, { params })
      .pipe(
        switchMap((users: User[]) => {
          if (users.length === 0) {
            const newUser = { id: user.id, fullName: user.fullName, username: user.username, password: user.password, role: 'User' };
            return this.http.post<User>(USER_URL, newUser);
          }
          return throwError(() => new Error(ERROR_MESSAGES.EXIST_USERNAME));
        })
      )
  }

  public getAccount(user: User): Observable<User> {
    const params = new HttpParams().set('username', user.username!).set('password', user.password!);
    return this.http.get<User[]>(`${USER_URL}`, { params })
      .pipe(
        switchMap((users: User[]) => {
          if (users.length === 0) {
            return throwError(() => new Error(ERROR_MESSAGES.LOGIN_FAILED));
          }
          return users;
        })
      )
  }

  private getAccountByUserId(userId: string): Observable<User> {
    return this.http.get<User>(`${USER_URL}/${userId}`);
  }

  private trackUserSession() {
    const user = this.storageService.getData<User>(STORAGE_KEYS.USER);
    if (!user) return;

    this.getAccountByUserId(user.id!).subscribe({
      next: (user) => {
        if(!user || !user.id) return;

        this.userId.set(user.id);
        this.addUserToStore(user);
      }
    })
  }

  public getRole(): Observable<string> {
    const user = this.storageService.getData<User>(STORAGE_KEYS.USER);
    if (!user || !user.id) return of();

    return this.getAccountByUserId(user.id).pipe(
      map(user => user.role!),
      catchError(() => of())
    );
  }

  private addUserToStore(user: User){
    const { password, ...userWithoutPassword } = user;
    this.store.dispatch(setCurrentUser({ user: userWithoutPassword }));
  }
}

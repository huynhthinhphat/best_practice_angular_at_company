import { HttpClient, HttpParams } from '@angular/common/http';
import { effect, inject, Injectable, signal } from '@angular/core';
import { catchError, map, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { User } from '../../models/user.model';
import { USER_URL } from '../../constants/url.constants';
import { ERROR_MESSAGES } from '../../constants/message.constants';
import { STORAGE_KEYS } from '../../constants/storage.constants';
import { CartService } from '../cart-service/cart-service';
import { StorageService } from '../storage-service/storage-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private cartService = inject(CartService);
  private storageService = inject(StorageService);

  public currentUser = signal<User | null>(null);

  constructor() {
    effect(() => {
      this.trackUserSession();
    })
  }

  public addAccount(user: User): Observable<User> {
    const params = new HttpParams().set('username', user.username);
    return this.http.get<User[]>(USER_URL, { params } )
    .pipe(
      switchMap((users : User[]) => {
        if (users.length === 0) {
          const newUser = { id: user.id, fullName: user.fullName, username: user.username, password: user.password, role: 'User' };
          return this.http.post<User>(USER_URL, newUser);
        }
        return throwError(() => new Error(ERROR_MESSAGES.EXIST_USERNAME));
      })
    )
  }

  public getAccount(user: User): Observable<User> {
    const params = new HttpParams().set('username', user.username).set('password', user.password);
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

  public logout() {
    if(!this.currentUser()) return;

    this.currentUser.set(null);
    localStorage.clear();
  }

  private trackUserSession() {
    const user = this.currentUser();

    if (user) {
      this.storageService.saveData<User>(STORAGE_KEYS.USER, { ...user, password: '' });
      this.cartService.getCartByCartId();
      return;
    }

    if (user === null) {
      const user = this.storageService.getData<User>(STORAGE_KEYS.USER);
      if (!user) return;

      this.currentUser.set(user);
    }
  }

  public isAdmin(): Observable<boolean> {
    const user = this.storageService.getData<User>(STORAGE_KEYS.USER);
    if (!user) return of(false);

    return this.getAccountByUserId(user.id!).pipe(
    map(u => !!u && u.role !== 'User'),
    catchError(() => of(false))
  );
  }
}

import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of, switchMap, throwError } from 'rxjs';
import { User } from '../../models/user.model';
import { USER_URL } from '../../constants/url.constants';
import { ERROR_MESSAGES } from '../../constants/message.constants';
import { STORAGE_KEYS } from '../../constants/storage.constants';
import { StorageService } from '../storage-service/storage-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private storageService = inject(StorageService);

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

  public getRole(): Observable<string> {
    const user = this.storageService.getData<User>(STORAGE_KEYS.USER);
    if (!user || !user.id) return of('User');

    return this.getAccountByUserId(user.id).pipe(
      map(user => user.role!),
      catchError(() => of('User'))
    );
  }
}

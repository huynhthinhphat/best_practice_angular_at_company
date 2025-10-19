import { HttpClient, HttpParams } from '@angular/common/http';
import { effect, inject, Injectable } from '@angular/core';
import { User } from '../../models/user.model';
import { USER_URL } from '../../constants/url.constants';
import { PaginationResponse } from '../../models/pagination-response.model';
import { map, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { ERROR_MESSAGES } from '../../constants/message.constants';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);

  constructor() {
    effect(() => {
      this.getUsersByCondition();
    })
  }

  public onLogin(user: User): Observable<User> {
    const params = new HttpParams().set('username', user.username!).set('password', user.password!);
    
    return this.http.get<User[]>(USER_URL, { params }).pipe(
      map(users => {
        if (!users || users.length === 0) {
          throw new Error(ERROR_MESSAGES.LOGIN_FAILED);
        }
        return users[0];
      })
    )
  }

  public getUsersByCondition(page: string = '1') {
    const params = new HttpParams().set('_page', page);
    this.http.get<PaginationResponse<User>>(USER_URL, { params }).subscribe({
      next: ((res: PaginationResponse<User>) => {
        if (!res) return;

      })
    })
  }

  public getUserById(userId: string): Observable<User | null>{
    return this.http.get<User>(`${USER_URL}/${userId}`).pipe(
      switchMap((user) => {
        if(user){
          return of(user);
        }
        return of(null);
      })
    )
  }
}

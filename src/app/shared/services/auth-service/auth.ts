import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { EMPTY, map, Observable, switchMap } from 'rxjs';
import { User } from '../../models/user.model';
import { AUTH_URL } from '../../constants/url.constants';
import { ERROR_MESSAGES } from '../../constants/message.constants';
import { STORAGE_KEYS } from '../../constants/storage.constants';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);

  public currentUserSignal = signal<User | null>(null);
  public errorSignal = signal<string>('');

  constructor(){
    this.currentUserSignal.set(this.getUserFromStorage());
  }

  public addAccount(user : User): Observable<User>{
    return this.isAccountExist(user.username).pipe(
      switchMap(exist => {
        if(!exist){
          return this.http.post<User>(AUTH_URL, user);
        }
        this.errorSignal.set(ERROR_MESSAGES.existUsername);
        return EMPTY;
      })
    )
  }

  private isAccountExist(username: string): Observable<boolean>{
    return this.getUsernameByUsername(username).pipe(
      map(res => res.length > 0)
    )
  }

  public getUsernameByUsername(username: string): Observable<User[]>{
    let params = new HttpParams().set('username', username)
    return this.http.get<User[]>(`${AUTH_URL}`, { params });
  }

  public getUserByUsernameAndPassword(username: string, password: string): Observable<User[]>{
    let params = new HttpParams().set('username', username).set('password', password)
    return this.http.get<User[]>(`${AUTH_URL}`, { params })
  }

  public clearErrorSignal(){
    this.errorSignal.set('');
  }

  public saveUserToStorage(user: User): void {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify({id: user.id, username: user.username, fullName: user.fullName}));
  }

  public getUserFromStorage(): User | null {
    const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
    return storedUser ? JSON.parse(storedUser) : null;
  }

  public logout(){
    if(this.currentUserSignal()){
      this.currentUserSignal.set(null);
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  }
}

import { HttpClient, HttpParams } from '@angular/common/http';
import { effect, inject, Injectable, signal } from '@angular/core';
import { Observable, switchMap, tap, throwError } from 'rxjs';
import { User } from '../../models/user.model';
import { AUTH_URL } from '../../constants/url.constants';
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

  public currentUserSignal = signal<User | null>(null);
  public errorSignal = signal<string>('');

  constructor(){
    effect(()=>{
      this.trackUserSession();
    })
  }

  public addAccount(user : User): Observable<User>{
    return this.getUserByUsernameAndPassword(user.username, user.password).pipe(
      switchMap(data => {
        if(data.length === 0){
          return this.http.post<User>(AUTH_URL, {id: user.id, fullName: user.fullName, username: user.username, password: user.password, role: 'User'}).pipe(
            tap(() => this.errorSignal.set(''))
          );
        }
        return throwError(() => new Error(ERROR_MESSAGES.EXIST_USERNAME));
      })
    )
  }

  public getAccount(user : User): Observable<User>{
    return this.getUserByUsernameAndPassword(user.username, user.password).pipe(
      switchMap(data => {
        if(data.length === 0){
          return throwError(() => new Error(ERROR_MESSAGES.LOGIN_FAILED));
        }
        return data;
      }),
      tap(() => this.errorSignal.set(''))
    )
  }

  private getUserByUsernameAndPassword(username: string, password: string): Observable<User[]>{
    let params = new HttpParams().set('username', username).set('password', password)
    return this.http.get<User[]>(`${AUTH_URL}`, { params });
  }

  public logout(){
    if(this.currentUserSignal()){
      this.currentUserSignal.set(null);
      localStorage.clear();
    }
  }

  private trackUserSession() {
    const user = this.currentUserSignal();

    if(user){
      this.storageService.saveData<User>(STORAGE_KEYS.USER, {...user,password: ''});
      this.cartService.getCartByCartId();
    }else if(user === null){
      const user = this.storageService.getData<User>(STORAGE_KEYS.USER);

      if(!user) return;
      this.currentUserSignal.set(user);
    }
  }
}

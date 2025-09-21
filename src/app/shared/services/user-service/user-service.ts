import { HttpClient, HttpParams } from '@angular/common/http';
import { effect, inject, Injectable, signal } from '@angular/core';
import { User } from '../../models/user.model';
import { USER_URL } from '../../constants/url.constants';
import { PaginationResponse } from '../../models/pagination-response.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);

  public users = signal<User[]>([]);
  public pagination = signal<PaginationResponse<User> | null>(null);

  constructor() {
    effect(() => {
      this.getUsersByCondition();
    })
  }

  public getUsersByCondition(page: string = '1') {
    const params = new HttpParams().set('_page', page);
    this.http.get<PaginationResponse<User>>(USER_URL, { params }).subscribe({
      next: ((res: PaginationResponse<User>) => {
        if (!res) return;

        this.users.set(res.data);
        this.pagination.set(res);
      })
    })
  }
}

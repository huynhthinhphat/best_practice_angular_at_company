import { HttpClient, HttpParams } from '@angular/common/http';
import { effect, inject, Injectable, signal } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { Category } from '../../models/category.model';
import { CATEGORY_URL } from '../../constants/url.constants';
import { AuthService } from '../auth-service/auth';
import { ERROR_MESSAGES } from '../../constants/message.constants';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  public categories = signal<Category[]>([]);
  private currentUser = this.authService.currentUser;

  constructor() {
    effect(() => {
      this.getAllCategoriesByConditions();
    })
  }

  public getAllCategoriesByConditions() {
    const user = this.currentUser();
    let isUser: boolean = false;
    if (!user || user?.role === 'User') {
      isUser = true;
    }

    const params = new HttpParams().set('isDeleted', false);
    this.http.get<Category[]>(CATEGORY_URL, { params }).subscribe(res => {
      if (!res) return;

      if (isUser) {
        this.categories.set([{ id: '', name: 'All', icon: 'border-all' }, ...res]);
        return;
      }
      this.categories.set([...res]);
    });
  }

  public getCategoryById(id: string): Observable<Category> {
    return this.http.get<Category>(`${CATEGORY_URL}/${id}`);
  }

  public getCategoryByName(name: string): Observable<Category[]> {
    const params = new HttpParams().set('name', name);
    return this.http.get<Category[]>(`${CATEGORY_URL}`, { params });
  }

  public handleSoftDeletion(category: Category): Observable<Category> {
    if (!category) return throwError(() => new Error(ERROR_MESSAGES.NO_CATEGORY_TO_DELETE));

    category = { ...category, isDeleted: true };
    return this.http.put<Category>(`${CATEGORY_URL}/${category.id}`, category);
  }

  public saveCategory(category: Category, action: string): Observable<Category> {
    if (!category) return throwError(() => new Error(ERROR_MESSAGES.NO_CATEGORY_TO_UPDATE));

    if (action === 'update') {
      return this.http.put<Category>(`${CATEGORY_URL}/${category.id}`, category)
    }
    return this.http.post<Category>(CATEGORY_URL, category);
  }
}

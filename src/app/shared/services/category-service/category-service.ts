import { HttpClient, HttpParams } from '@angular/common/http';
import { effect, inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../../models/category.model';
import { CATEGORY_URL } from '../../constants/url.constants';
import { PaginationResponse } from '../../models/pagination-response.model';
import { AuthService } from '../auth-service/auth';
import { ERROR_MESSAGES } from '../../constants/message.constants';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  public categories = signal<Category[]>([]);
  public pagination = signal<PaginationResponse<Category> | null>(null);
  private currentUse = this.authService.currentUserSignal;

  constructor() {
    effect(() => {
      this.getAllCategoriesByConditions();
    })
  }

  public getAllCategoriesByConditions(page: string = '1') {
    const params = new HttpParams().set('_page', page).set('isDeleted', false);
    this.http.get<PaginationResponse<Category>>(CATEGORY_URL, { params }).subscribe(res => {

      if (!this.currentUse() || this.currentUse()?.role === 'User') {
        this.categories.set([{ id: '', name: 'All' }, ...res.data]);
        return;
      }

      this.categories.set([...res.data]);
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
    if (!category) throw new Error(ERROR_MESSAGES.NO_CATEGORY_TO_DELETE);

    category = { ...category, isDeleted: true };
    return this.http.put<Category>(`${CATEGORY_URL}/${category.id}`, category);
  }

  public saveCategory(category: Category, action: string): Observable<Category> {
    if (!category) throw new Error(ERROR_MESSAGES.NO_CATEGORY_TO_UPDATE);

    if (action === 'update') {
      return this.http.put<Category>(`${CATEGORY_URL}/${category.id}`, category)
    }
    return this.http.post<Category>(CATEGORY_URL, category);
  }
}

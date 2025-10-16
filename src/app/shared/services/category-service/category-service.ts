import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { Category } from '../../models/category.model';
import { CATEGORY_URL } from '../../constants/url.constants';
import { ERROR_MESSAGES } from '../../constants/message.constants';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private http = inject(HttpClient);

  public categories = signal<Category[]>([]);

  public getAllCategoriesByConditions(isDeleted : boolean = false): Observable<Category[]> {
    const params = new HttpParams().set('isDeleted', isDeleted);
    return this.http.get<Category[]>(CATEGORY_URL, { params });
  }

  public getCategoryById(id: string): Observable<Category> {
    return this.http.get<Category>(`${CATEGORY_URL}/${id}`);
  }

  public getCategoryByName(name: string): Observable<Category[]> {
    const params = new HttpParams().set('name', name);
    return this.http.get<Category[]>(`${CATEGORY_URL}`, { params });
  }

  public handleSoftDeletion(category: Category): Observable<Category> {
    if (!category) return throwError(() => new Error(ERROR_MESSAGES.NOT_FOUND_TO_DELETE));

    category = { ...category, isDeleted: true };
    return this.http.put<Category>(`${CATEGORY_URL}/${category.id}`, category);
  }

  public saveCategory(category: Category, action: string): Observable<Category> {
    if (!category) return throwError(() => new Error(ERROR_MESSAGES.NOT_FOUND_TO_SAVE));

    if (action === 'update') {
      return this.http.put<Category>(`${CATEGORY_URL}/${category.id}`, category)
    }
    return this.http.post<Category>(CATEGORY_URL, category);
  }
}

import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { catchError, forkJoin, Observable, of, switchMap, throwError } from 'rxjs';
import { Category } from '../../models/category.model';
import { CATEGORY_URL } from '../../constants/url.constants';
import { ERROR_MESSAGES } from '../../constants/message.constants';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private http = inject(HttpClient);

  public categoryName = signal<string>('');

  public getAllCategoriesByConditions(isDeleted : boolean = false): Observable<Category[]> {
    const params = new HttpParams().set('isDeleted', isDeleted);
    return this.http.get<Category[]>(CATEGORY_URL, { params });
  }

  public getCategoryById(id: string): Observable<Category> {
    return this.http.get<Category>(`${CATEGORY_URL}/${id}`);
  }

  public checkCategoryExist(prevCategory: Category | null, nextCategory: Category): Observable<Category> {
    if(nextCategory.name?.trim().length === 0){
      return throwError(() => new Error(ERROR_MESSAGES.INVALID_CATEGORY_NAME));
    }
    
    const params = new HttpParams().set('name', nextCategory.name?.trim()!);
    return this.http.get<Category[]>(`${CATEGORY_URL}`, { params }).pipe(
      switchMap((categories) => {
        const isExist = categories.length > 0;
        const isUpdate = !!nextCategory.id;
        const hasNameChanged = prevCategory && (prevCategory.name?.trim() !== nextCategory.name?.trim());
        if (isExist && (isUpdate && hasNameChanged || !isUpdate)) {
          return throwError(() => new Error(ERROR_MESSAGES.EXISTED_CATEGORY));
        }

        let category: Category = {
          ...nextCategory,
          updatedAt: new Date()
        }

        return of(category);
      })
    )
  }

  public deleteCategories(ids: string[]): Observable<Category[]> {
    if (ids.length === 0) return throwError(() => new Error(ERROR_MESSAGES.NOT_FOUND_TO_DELETE));  
  
    const requests = ids.map(id => {
      return this.http.patch<Category>(`${CATEGORY_URL}/${id}`, { isDeleted: true });
    });
  
    return forkJoin(requests).pipe(
      catchError(err => throwError(() => err))
    );
  }

  public updateCategory(category: Category): Observable<Category> {
    return this.http.patch<Category>(`${CATEGORY_URL}/${category.id}`, { ...category });
  }

  public addCategory(category: Category): Observable<Category> {
    return this.http.post<Category>(`${CATEGORY_URL}`, { ...category, isDeleted: false, createdAt: new Date()});
  }
}

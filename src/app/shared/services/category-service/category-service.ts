import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../../models/category.model';
import { CATEGORY_URL } from '../../constants/url.constants';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private http = inject(HttpClient);

  public categories = signal<Category[]>([]);

  constructor(){
    this.getAllCategoriesByConditions();
  }

  private getAllCategoriesByConditions() {
    this.http.get<Category[]>(CATEGORY_URL).subscribe(categories => {
      this.categories.set([{id: '', name: 'All'}, ...categories]);
    });
  }
}

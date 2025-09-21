import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { catchError, EMPTY } from 'rxjs';
import { CategoryService } from '../../services/category-service/category-service';
import { Category } from '../../models/category.model';

export const categoryDetailResolver: ResolveFn<Category> = (route) => {
  const router = inject(Router);
  const categoryService = inject(CategoryService);
  const id = route.params['id'];

  return categoryService.getCategoryById(id).pipe(
    catchError(() => {
      router.navigate(['/not-found']);
      return EMPTY;
    })
  );
};

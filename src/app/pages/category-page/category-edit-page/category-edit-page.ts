import { Component, inject, OnInit, signal } from '@angular/core';
import { Category } from '../../../shared/models/category.model';
import { ActivatedRoute } from '@angular/router';
import { CategoryService } from '../../../shared/services/category-service/category-service';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { Location } from '@angular/common';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../../../shared/constants/message.constants';
import { switchMap, throwError } from 'rxjs';

@Component({
  selector: 'app-category-edit-page',
  imports: [FormsModule],
  templateUrl: './category-edit-page.html',
  styleUrl: './category-edit-page.css'
})
export class CategoryEditPage implements OnInit {
  private route = inject(ActivatedRoute);
  private categoryService = inject(CategoryService);
  private toastrService = inject(ToastrService);
  private location = inject(Location)

  public category = signal<Category | null>(null);
  public categoryName: string = '';

  public ngOnInit(): void {
    this.loadCategory();
  }

  private loadCategory() {
    const category = this.route.snapshot.data['category'];
    if (!category) return;

    this.category.set(category);
    this.categoryName = this.category()?.name!;
  }

  public saveCategory(action: string) {
    if (this.categoryName.trim() === '') {
      this.toastrService.warning(ERROR_MESSAGES.INVALID_CATEGORY);
      return;
    }

    this.categoryService.getCategoryByName(this.categoryName).pipe(
      switchMap((res: Category[]) => {
        if (res.length > 0) {
          return throwError(() => new Error(ERROR_MESSAGES.EXISTED_CATEGORY))
        }

        this.category.set({ ...this.category(), name: this.categoryName });
        return this.categoryService.saveCategory(this.category()!, action)
      })
    ).subscribe({
      next: ((res: Category) => {
        if (!res) return;

        if (action === 'update') {
          this.toastrService.success(SUCCESS_MESSAGES.UPDATE_CATEGORY);
        } else {
          this.toastrService.success(SUCCESS_MESSAGES.CREATE_CATEGORY);
        }
        this.location.back();
      }),
      error: (err) => {
        this.toastrService.error(err.message);
      },
    })
  }

  public goBack() {
    this.location.back();
  }
}
import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CategoryService } from '../../../shared/services/category-service/category-service';
import { ColumnDef } from '../../../shared/models/column-def.model';
import { Category } from '../../../shared/models/category.model';
import { SUCCESS_MESSAGES, SWAL_MESSAGES } from '../../../shared/constants/message.constants';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-category-list-page',
  imports: [ RouterLink ],
  templateUrl: './category-list-page.html',
  styleUrl: './category-list-page.css'
})
export class CategoryListPage implements OnInit {
  private categoryService = inject(CategoryService);
  private router = inject(Router);
  private toastrService = inject(ToastrService);

  public categories = this.categoryService.categories;
  public currentPage = signal<number>(1);
  public headers: ColumnDef<Category>[] = [
    { field: 'name', headerText: 'Category Name' }
  ]

  public ngOnInit() {
    this.categoryService.getAllCategoriesByConditions();
  }

  public handleAction(event: { action: string, rowData: Category }) {
    if (event.action === 'Edit') {
      this.router.navigate([`/admin/categories/edit/${event.rowData.id}`], { state: { isAdmin: true } });
    } else if (event.action === 'Delete') {
      this.handleSoftDeletion(event.rowData);
    }
  }

  public handlePageChange = (page: number) => {
    this.currentPage.set(page);
    // this.categoryService.getAllCategoriesByConditions(page.toString());
  }

  private handleSoftDeletion(product: Category) {
    Swal.fire({
      title: SWAL_MESSAGES.CONFIRM_UPDATE_ORDER_TITLE,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: SWAL_MESSAGES.BUTTON_CONFIRM_ORDER,
      cancelButtonText: SWAL_MESSAGES.BUTTON_CANCEL,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6'
    }).then((result) => {
      if (!result.isConfirmed || !product) return;

      this.categoryService.handleSoftDeletion(product).subscribe({
        next: ((res: Category) => {
          if (!res) return;

          this.toastrService.success(SUCCESS_MESSAGES.DELETE);
        }),
        error: ((error) => {
          this.toastrService.error(error.message);
        }),
        complete: (() => this.categoryService.getAllCategoriesByConditions())
      })
    });
  }
}

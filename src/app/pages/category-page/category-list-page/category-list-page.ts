import { Component, inject, OnInit, signal } from '@angular/core';
import { AppTable } from '../../../shared/app-table/app-table';
import { AppPagination } from '../../../shared/app-pagination/app-pagination';
import { Router, RouterLink } from '@angular/router';
import { CategoryService } from '../../../shared/services/category-service/category-service';
import { ColumnDef } from '../../../shared/models/column-def.model';
import { Category } from '../../../shared/models/category.model';
import { Actions } from '../../../shared/models/actions.model';
import Swal from 'sweetalert2';
import { SUCCESS_MESSAGES, SWAL_MESSAGES } from '../../../shared/constants/message.constants';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-category-list-page',
  imports: [AppTable, AppPagination, RouterLink],
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
    { field: 'name', headerText: 'Category Name' },
    {
      headerText: 'Action', columnType: "action", actions: [
        {
          label: 'Edit',
          class: 'edit',
          icon: 'pi pi-pencil',
          tooltip: 'Edit product'
        },
        {
          label: 'Delete',
          class: 'delete',
          icon: 'pi pi-trash',
          tooltip: 'Delete product'
        }
      ]
    }
  ]

  public ngOnInit() {
    this.categoryService.getAllCategoriesByConditions();
  }

  public handleAction(event: { action: Actions<Category>, rowData: Category }) {
    if (event.action.label === 'Edit') {
      this.router.navigate([`/admin/categories/edit/${event.rowData.id}`], { state: { isAdmin: true } });
    } else if (event.action.label === 'Delete') {
      this.handleSoftDeletion(event.rowData);
    }
  }

  public handlePageChange = (page: number) => {
    this.currentPage.set(page);
    this.categoryService.getAllCategoriesByConditions(page.toString());
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

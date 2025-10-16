import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CategoryService } from '../../../shared/services/category-service/category-service';
import { ColumnDef } from '../../../shared/models/column-def.model';
import { Category } from '../../../shared/models/category.model';
import { FORM, SUCCESS_MESSAGES, SWAL_MESSAGES } from '../../../shared/constants/message.constants';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { AppPagination } from '../../../shared/app-pagination/app-pagination';
import { Store } from '@ngrx/store';
import { AppState } from '../../../state/app.state';
import { FormFields } from '../../../shared/models/form-field.model';
import { Validators } from '@angular/forms';
import { CategoryStoreService } from '../../../shared/services/category-service/category-store-service';

@Component({
  selector: 'app-category-list-page',
  imports: [RouterLink, AppPagination],
  templateUrl: './category-list-page.html',
  styleUrl: './category-list-page.css'
})
export class CategoryListPage implements OnInit {
  private store = inject(Store<AppState>);
  private categoryService = inject(CategoryService);
  private categoryStoreService = inject(CategoryStoreService);
  private toastrService = inject(ToastrService);

  public categoryStore = this.categoryStoreService.categories;
  public originalCategories = signal<Category[]>([]);
  public allCategories = signal<Category[]>([]);
  public quantityItem = signal<number>(10);
  public currentPage = signal<number>(1);
  public startIndex = signal<number>(1);
  public endIndex = signal<number>(10);
  public showDialog = signal<boolean>(false);
  public buttonLabel = FORM.SAVE;
  public oldCategory: Category | null = null;
  public headers: ColumnDef<Category>[] = [
    { 
      field: 'name', 
      headerText: 'Name', 
      isResize: true,
      isShow: true,
      width: 300
    },
    { 
      field: 'createdAt', 
      headerText: 'Created At', 
      pipe: 'date',
      isResize: true,
      isShow: true,
      width: 300   
    },
    { 
      field: 'updatedAt', 
      headerText: 'Updated At', 
      pipe: 'date',
      isResize: true,
      isShow: true,
      width: 300   
    }
  ]
  public fields: FormFields[] = [
    {
      name: 'id',
      label: 'id',
      type: 'text',
      validator: [],
      defaultValue: ''
    },
    {
      name: 'name',
      label: 'Name',
      type: 'text',
      validator: [Validators.required],
      defaultValue: ''
    }
  ];

  constructor() {
    effect(() => {
      this.allCategories.set(this.categoryStore());
    })
  }
  
  ngOnInit() {
    this.setCategories();
  }

  private setCategories() {
    this.categoryStoreService.setCategories();
    this.setInitialEndIndex()
  }

  private setInitialEndIndex() {
    const length = this.allCategories().length;
    if (length > 0) {
      const endIndex = length < this.endIndex() ? length : this.endIndex();
      this.endIndex.set(endIndex)
    }
  }

  public handleAction(event: { action: string, rowData: Category }) {
    const { action, rowData } = event;

    this.oldCategory = rowData;
    
    if (action === 'Edit') {
      this.showDialog.set(true);
      return;
    }
    // if (event.action === 'Edit') {
    //   this.router.navigate([`/admin/categories/edit/${event.rowData.id}`], { state: { isAdmin: true } });
    // } else if (event.action === 'Delete') {
    //   this.handleSoftDeletion(event.rowData);
    // }
  }

  public handlePageChange = (page: number) => {
    this.currentPage.set(page);
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
      })
    });
  }

  public handleNavigation(direction: -1 | 1) {
    let quantity = this.quantityItem();
    let total = this.allCategories().length;
    let steps = quantity * direction;

    let nextStart = this.startIndex() + steps;
    let nextEnd = this.endIndex() + steps;

    if (this.endIndex() === total) {
      nextEnd = nextStart + quantity - 1;
    } else if (nextEnd > total) {
      nextEnd = total;
    }

    this.startIndex.set(nextStart);
    this.endIndex.set(nextEnd);
  }

  public handleQuantityItem(quantityItem: number) {
    this.quantityItem.set(quantityItem)

    let total = this.allCategories().length;
    let quantity = quantityItem > total ? total : quantityItem;

    this.startIndex.set(1);
    this.endIndex.set(quantity)
  }
}

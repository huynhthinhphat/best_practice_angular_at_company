import { Component, inject, OnInit, signal } from '@angular/core';
import { CategoryService } from '../../../shared/services/category-service/category-service';
import { ColumnDef } from '../../../shared/models/column-def.model';
import { Category } from '../../../shared/models/category.model';
import { FORM, SUCCESS_MESSAGES, SWAL_MESSAGES } from '../../../shared/constants/message.constants';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { Store } from '@ngrx/store';
import { FormFields } from '../../../shared/models/form-field.model';
import { Validators } from '@angular/forms';
import { selectAllCategories, selectIsOpenDialog } from '../../../shared/services/category-service/state/category.selector';
import { AppGridView } from '../../../shared/app-grid-view/app-grid-view';
import { addCategory, deleteCategories, updateCategory } from '../../../shared/services/category-service/state/category.action';

@Component({
  selector: 'app-category-list-page',
  imports: [AppGridView],
  templateUrl: './category-list-page.html',
  styleUrl: './category-list-page.css'
})
export class CategoryListPage implements OnInit {
  private store = inject(Store);

  public allCategories = signal<Category[]>([]);
  public showDialog = signal<boolean>(false);
  public titleDialog = FORM.TITLE_EDIT_CATEGORY;
  public buttonLabel = FORM.SAVE;
  public oldCategory: Category | null = null;
  public isOpenDialog = signal<boolean>(false);
  public headers: ColumnDef<Category>[] = [
    {
      field: 'id',
      headerText: 'id',
      isShow: false,
      isRedirect: false
    },
    { 
      field: 'name', 
      headerText: 'Name', 
      isResize: true,
      isShow: true,
      width: 200,
      isRedirect: false,
      isSort: true
    },
    {
      field: 'icon',
      headerText: 'Icon',
      isShow: true,
      isRedirect: false
    },
    { 
      field: 'createdAt', 
      headerText: 'Created At', 
      pipe: 'date',
      isResize: true,
      isShow: true,
      width: 300,
      isRedirect: false,
      isSort: true
    },
    { 
      field: 'updatedAt', 
      headerText: 'Updated At', 
      pipe: 'date',
      isResize: true,
      isShow: true,
      width: 300,
      isRedirect: false,
      isSort: true
    }
  ]
  public fields: FormFields[] = [
    {
      name: 'id',
      label: 'id',
      type: 'text',
      validator: [],
      defaultValue: '',
      isShow: false
    }, 
    {
      name: 'icon',
      validator: [],
      defaultValue: '',
      isShow: false
    },
    {
      name: 'name',
      label: 'Name',
      type: 'text',
      validator: [Validators.required],
      defaultValue: '',
      isShow: true
    },
    {
      name: 'icon',
      label: 'Icon',
      type: 'text',
      validator: [],
      defaultValue: '',
      isShow: false
    },
    {
      name: 'createdAt',
      label: 'Created At',
      type: 'date',
      validator: [],
      defaultValue: '',
      isShow: false
    }
  ];
  
  ngOnInit() {
    this.store.select(selectAllCategories).subscribe(categories => this.allCategories.set(categories));
  }

  public handleActions(event: { action?: string, prevData?: Category | null, newData?: Category | null, ids?: string[] }) {
    const { action, prevData, newData, ids } = event;

    if (action === 'delete' && ids?.length) {
      this.handleDelete(ids);
      return;
    }

    if (action === 'submit') {
      if(!newData) return;

      if(!prevData){
        delete newData?.id;
        this.store.dispatch(addCategory({category : newData}))
      } else {
        this.store.dispatch(updateCategory({ prevCategory: prevData, newData: newData}))
      }

      this.store.select(selectIsOpenDialog).subscribe(isShow => {
        this.isOpenDialog.set(!isShow)
      })
    }
  }

  private handleDelete(ids: string[]) {
    Swal.fire({
      title: SWAL_MESSAGES.CONFIRM_UPDATE_ORDER_TITLE,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: SWAL_MESSAGES.BUTTON_CONFIRM_ORDER,
      cancelButtonText: SWAL_MESSAGES.BUTTON_CANCEL,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6'
    }).then((result) => {
      if (!result.isConfirmed) return;

      this.store.dispatch(deleteCategories({ids: ids}))
    });
  }
}

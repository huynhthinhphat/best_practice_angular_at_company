import Swal from 'sweetalert2';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Validators } from '@angular/forms';
import { User } from '../../../shared/models/user.model';
import { Product } from '../../../shared/models/product.model';
import { ColumnDef } from '../../../shared/models/column-def.model';
import { FormFields } from '../../../shared/models/form-field.model';
import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { AppGridView } from '../../../shared/app-grid-view/app-grid-view';
import { AppCardView } from '../../../shared/app-card-view/app-card-view';
import { STORAGE_KEYS } from '../../../shared/constants/storage.constants';
import { CartService } from '../../../shared/services/cart-service/cart-service';
import { selectUser } from '../../../shared/services/user-service/state/user.selector';
import { StorageService } from '../../../shared/services/storage-service/storage-service';
import { selectAllCategories } from '../../../shared/services/category-service/state/category.selector';
import { selectProductsByConditions, selectIsOpenDialog } from '../../../shared/services/product-service/state/product.selector';
import { BUTTON_TOOLTIP, ERROR_MESSAGES, FORM, SUCCESS_MESSAGES, SWAL_MESSAGES } from '../../../shared/constants/message.constants';
import { addProduct, deleteProducts, loadProducts, updateProduct } from '../../../shared/services/product-service/state/product.action';
import { toSignal } from '@angular/core/rxjs-interop';
import { ProductService } from '../../../shared/services/product-service/product-service';
import { tap } from 'rxjs';
import { CategoryService } from '../../../shared/services/category-service/category-service';

@Component({
  selector: 'app-product-page',
  imports: [AppGridView, AppCardView],
  templateUrl: './product-list-page.html',
  styleUrl: './product-list-page.scss',
  standalone: true
})
export class ProductListPage implements OnInit {
  private store = inject(Store);
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  private cartService = inject(CartService);
  private router = inject(Router);
  private toastr = inject(ToastrService)
  private storageService = inject(StorageService);

  public currentUser = toSignal(this.store.select(selectUser));
  public allProducts = signal<Product[]>([]);
  public headers: ColumnDef<Product>[] = [
    {
      field: 'id',
      isShow: false
    },
    {
      field: 'name',
      headerText: 'Name',
      isSort: true,
      isResize: true,
      width: 320,
      isShow: true,
      isRedirect: true
    },
    {
      field: 'description',
      headerText: 'Description',
      isSort: false,
      isResize: true,
      width: 320,
      isShow: true
    },
    {
      field: 'stock',
      headerText: 'Stock',
      isSort: true,
      isResize: true,
      isShow: true
    },
    {
      field: 'price',
      headerText: 'Price',
      pipe: 'currency',
      isSort: true,
      isResize: true,
      isShow: true,
      isRedirect: true
    },
    {
      field: 'categoryName',
      headerText: 'Category Name',
      isSort: true,
      isResize: true,
      isShow: false,
      isRedirect: true
    },
    {
      field: 'createdAt',
      headerText: 'Created At',
      pipe: 'date',
      width: 150,
      isSort: true,
      isResize: true,
      isShow: true,
      isRedirect: true
    },
    {
      field: 'updatedAt',
      headerText: 'Updated At',
      pipe: 'date',
      width: 150,
      isSort: true,
      isResize: true,
      isShow: true,
      isRedirect: true
    },
  ];
  public isCardView = signal<boolean>(true);
  public titleGridBtn = BUTTON_TOOLTIP.GIRD_VIEW;
  public titleCardBtn = BUTTON_TOOLTIP.CARD_VIEW;
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
      name: 'name',
      label: 'Name',
      type: 'text',
      validator: [Validators.required],
      defaultValue: '',
      isShow: true
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
      validator: [Validators.required],
      defaultValue: '',
      isShow: true
    },
    {
      name: 'stock',
      label: 'Stock',
      type: 'text',
      validator: [Validators.required],
      defaultValue: 0,
      isShow: true
    },
    {
      name: 'price',
      label: 'Price',
      type: 'text',
      validator: [Validators.required],
      defaultValue: 0,
      isShow: true
    },
    {
      name: 'categoryId',
      label: 'Category',
      type: 'select',
      validator: [Validators.required],
      categories: [],
      defaultValue: '',
      isShow: true
    },
    {
      name: 'imageUrl',
      label: 'Image',
      type: 'image',
      validator: [Validators.required],
      defaultValue: '',
      isShow: true
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
  public titleDialog = FORM.TITLE_EDIT_PRODUCT;
  public buttonLabel = FORM.SAVE;
  public isOpenDialog = signal<boolean>(false);

  constructor() {
    effect(() => {
      if (this.currentUser()?.role === 'Admin') {
        this.isCardView.set(false);
      }
    })

    effect(() => {
      this.store.select(selectProductsByConditions, { productName: '', categoryName: '', startIndex: 0, endIndex: undefined })
        .subscribe(data => this.allProducts.set([...data]));
    });

  }

  ngOnInit() {
    const user = this.currentUser();
    this.isCardView.set((!user || user.role === 'User') ? true : false)

    this.store.select(selectAllCategories).subscribe(categories => this.fields.find(field => field.name === 'categoryId')!.categories = categories);
  }

  public onClickProduct(productId: string) {
    if (!productId) return;
    this.router.navigate(['/products/detail', productId]);
  }

  public handleActions(event: { action?: string, prevData?: Product | null, newData?: Product | null, ids?: string[] }) {
    const { action, prevData, newData, ids } = event;

    if (action === 'delete' && ids?.length) {
      this.handleDelete(ids);
      return;
    }

    if (action === 'submit') {
      this.saveProduct(prevData!, newData!);
    }
  }

  private handleDelete(ids: string[]) {
    Swal.fire({
      title: SWAL_MESSAGES.CONFIRM_DELETE_TITLE,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: SWAL_MESSAGES.BUTTON_CONFIRM_ORDER,
      cancelButtonText: SWAL_MESSAGES.BUTTON_CANCEL,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6'
    }).then((result) => {
      if (!result.isConfirmed) return;

      this.store.dispatch(deleteProducts({ ids: ids }))
    });
  }

  public toggleView(isCardView: boolean) {
    this.isCardView.set(isCardView);
  }

  public toggleDialog() {
    this.isOpenDialog.set(true);
  }

  public handleEmit(item: { data: Product; action: string }) {
    if (!item || !item.data) return;

    const user = this.currentUser();
    if (!user) {
      this.toastr.error(ERROR_MESSAGES.LOGIN_REQUIRED);
      return;
    }

    if (user.role !== 'User') {
      this.toastr.error(ERROR_MESSAGES.PERMISSION_DENIED);
      return;
    }

    if (item.action === 'add') {
      this.addToCart(item.data);
    } else if (item.action === 'buy') {
      this.navigateToCheckout(item.data);
    }
  }

  private addToCart(product: Product) {
    this.cartService.handleCartItemToUpdate(product, 1).subscribe({
      next: (res) => {
        if (!res) return;

        this.toastr.success(SUCCESS_MESSAGES.ADD);
      },
      complete: () => {
        this.cartService.getCartByCartId();
      }
    });
  }

  private navigateToCheckout(product: Product) {
    const user = this.storageService.getData<User>(STORAGE_KEYS.USER);
    if (!user) {
      this.toastr.error(ERROR_MESSAGES.LOGIN_REQUIRED);
      return;
    }

    if (!product) return;

    product = { ...product, quantityToBuy: 1 };
    this.storageService.saveData<Product[]>(STORAGE_KEYS.CHECKOUT_PRODUCT_LIST, [product]);

    this.router.navigate(['/checkout'], { state: { fromProductDetailPage: true } });
  }

  private saveProduct(prevProduct: Product | null, newData: Product | null) {
    if (!newData) return;

    if (newData.name!.trim().length === 0) {
      this.toastr.warning(ERROR_MESSAGES.INVALID_PRODUCT_NAME);
      return;
    }

    const price = Number(newData.price);
    if (isNaN(price) || price < 0) {
      this.toastr.warning(ERROR_MESSAGES.INVALID_PRICE);
      return;
    }

    const stock = Number(newData.stock)
    if (isNaN(stock) || stock < 0) {
      this.toastr.warning(ERROR_MESSAGES.INVALID_STOCK);
      return;
    }
    if (prevProduct) {
      this.store.dispatch(updateProduct({ prevProduct: prevProduct!, newData: newData! }));
    } else {
      delete newData.id;
      this.store.dispatch(addProduct({ product: newData! }));
    }

    this.store.select(selectIsOpenDialog).subscribe(isShow => {
      this.isOpenDialog.set(!isShow)
    })
  }
}

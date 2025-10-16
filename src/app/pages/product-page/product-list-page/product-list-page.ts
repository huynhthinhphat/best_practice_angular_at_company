import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AppGridView } from '../../../shared/app-grid-view/app-grid-view';
import { ColumnDef } from '../../../shared/models/column-def.model';
import { Product } from '../../../shared/models/product.model';
import { ToastrService } from 'ngx-toastr';
import { AppCardView } from '../../../shared/app-card-view/app-card-view';
import { CartService } from '../../../shared/services/cart-service/cart-service';
import { STORAGE_KEYS } from '../../../shared/constants/storage.constants';
import { StorageService } from '../../../shared/services/storage-service/storage-service';
import { User } from '../../../shared/models/user.model';
import { FormFields } from '../../../shared/models/form-field.model';
import { BUTTON_TOOLTIP, ERROR_MESSAGES, FORM, SUCCESS_MESSAGES, SWAL_MESSAGES } from '../../../shared/constants/message.constants';
import Swal from 'sweetalert2';
import { Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from '../../../state/app.state';
import { toSignal } from '@angular/core/rxjs-interop';
import { getCurrentUser } from '../../../shared/services/user-service/state/user.selector';
import { CategoryStoreService } from '../../../shared/services/category-service/category-store-service';
import { Category } from '../../../shared/models/category.model';
import { addProduct, deleteProducts, loadProducts, updateProduct } from '../../../shared/services/product-service/state/product.action';
import { ProductService } from '../../../shared/services/product-service/product-service';
import { selectAllProducts } from '../../../shared/services/product-service/state/product.selector';

@Component({
  selector: 'app-product-page',
  imports: [AppGridView, AppCardView],
  templateUrl: './product-list-page.html',
  styleUrl: './product-list-page.scss',
  standalone: true
})
export class ProductListPage implements OnInit {
  private store = inject(Store<AppState>);
  private productService = inject(ProductService);
  private categoryStoreService = inject(CategoryStoreService);
  private cartService = inject(CartService);
  private router = inject(Router);
  private toastr = inject(ToastrService)
  private storageService = inject(StorageService);

  public currentUser = toSignal(this.store.select(getCurrentUser));

  private categoryStore = this.categoryStoreService.categories;
  public allCategories = signal<Category[]>([]);

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
      isShow: true
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
      isShow: true
    },
    {
      field: 'categoryName',
      headerText: 'Category Name',
      isSort: true,
      isResize: true,
      isShow: false
    },
    {
      field: 'createdAt',
      headerText: 'Created At',
      pipe: 'date',
      width: 150,
      isSort: true,
      isResize: true,
      isShow: true
    },
    {
      field: 'updatedAt',
      headerText: 'Updated At',
      pipe: 'date',
      width: 150,
      isSort: true,
      isResize: true,
      isShow: true
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
  public originalFields: FormFields[] = []; 
  public titleDialog = FORM.TITLE_EDIT_PRODUCT;
  public buttonLabel = FORM.SAVE;
  public oldProduct = signal<Product | null>(null);
  public isDialogHidden = signal<boolean>(false);
  public startIndex = signal<number>(1);
  public endIndex = signal<number>(10);
  public quantityItem = signal<number>(10);

  constructor() {
    effect(() => {
      this.allCategories.set(this.categoryStore());
      this.setCategories();

      if (this.currentUser()?.role === 'Admin') {
        this.isCardView.set(false);
      }

      this.originalFields = this.fields.map(field => ({ ...field }));
    })
  }

  ngOnInit() {
    this.store.dispatch(loadProducts());
    this.categoryStoreService.setCategories();
    
    const user = this.currentUser();
    this.isCardView.set((!user || user.role === 'User') ? true : false)

    this.store.select(selectAllProducts).subscribe(products => {
      this.allProducts.set(products)
    });
  }

  private setCategories() {
    this.fields.find(field => field.name === 'categoryId')!.categories = this.allCategories();
  }

  public onClickProduct(productId: string) {
    if (!productId) return;
    this.router.navigate(['/products/detail', productId]);
  }

  public handleActions(event: { action?: string, prevData?: Product | null, newData?: Product | null, ids?: string[] }) {
    const { action, prevData, newData, ids } = event;

    if (action === 'delete') {
      this.handleDelete(ids!);
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

      this.store.dispatch(deleteProducts({ids: ids}))
    });
  }

  public toggleView(isCardView: boolean) {
    this.isCardView.set(isCardView);
  }

  public toggleDialog() {
    this.isDialogHidden.set(true);
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

  private saveProduct(prevProduct: Product | null, nextProduct: Product | null) {
    if (!nextProduct) return;
    
    if (nextProduct.name!.trim() === '') {
      this.toastr.warning(ERROR_MESSAGES.INVALID_PRODUCT_NAME);
      return;
    }

    const price = Number(nextProduct.price);
    if (isNaN(price) || price < 0) {
      this.toastr.warning(ERROR_MESSAGES.INVALID_PRICE);
      return;
    }

    const stock = Number(nextProduct.stock)
    if (isNaN(stock) || stock < 0) {
      this.toastr.warning(ERROR_MESSAGES.INVALID_STOCK);
      return;
    }

    const categoryName = this.categoryStore().find(category => category.id === nextProduct.categoryId)?.name;
    const productName = nextProduct.name;

    this.productService.getProductByNameAndCategory(productName, categoryName!)
      .subscribe({
        next: (products) => {
          const isExisted = products.length > 0;
          const isUpdate = !!nextProduct.id;

          const hasNameOrCategoryChanged = prevProduct && (prevProduct.name !== productName || prevProduct.categoryName !== categoryName);

          if (((isUpdate && hasNameOrCategoryChanged) || !isUpdate) && isExisted) {
            this.toastr.error(ERROR_MESSAGES.EXISTED_PRODUCT);
            return;
          }

          let product: Product = { 
            ...nextProduct,
            categoryName: categoryName,
            price: price,
            stock: stock,
            updatedAt: new Date()
          };

          if (isUpdate) {
            console.log('update');
            this.store.dispatch(updateProduct({ product: product }));
          } else {
            console.log('create')
            delete product.id;
            this.store.dispatch(addProduct({ product: product }));
          }
          this.isDialogHidden.set(true)
        },
        error: (error) => this.toastr.error(error.message)
      }
    )
  }
}

import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { ProductService } from '../../../shared/services/product-service/product-service';
import { Router } from '@angular/router';
import { AuthService } from '../../../shared/services/auth-service/auth';
import { AppGridView } from '../../../shared/app-grid-view/app-grid-view';
import { ColumnDef } from '../../../shared/models/column-def.model';
import { Product } from '../../../shared/models/product.model';
import { ToastrService } from 'ngx-toastr';
import { AppCardView } from '../../../shared/app-card-view/app-card-view';
import { CartService } from '../../../shared/services/cart-service/cart-service';
import { STORAGE_KEYS } from '../../../shared/constants/storage.constants';
import { StorageService } from '../../../shared/services/storage-service/storage-service';
import { User } from '../../../shared/models/user.model';
import { AppDialog } from '../../../shared/app-dialog/app-dialog';
import { AppForm } from '../../../shared/app-form/app-form';
import { FormFields } from '../../../shared/models/form-field.model';
import { CategoryService } from '../../../shared/services/category-service/category-service';
import { BUTTON_TOOLTIP, ERROR_MESSAGES, FORM, SUCCESS_MESSAGES, SWAL_MESSAGES } from '../../../shared/constants/message.constants';
import Swal from 'sweetalert2';
import { Validators } from '@angular/forms';
import { AppPagination } from '../../../shared/app-pagination/app-pagination';
import { Store } from '@ngrx/store';
import { AppState } from '../../../app.state';
import { productSelector, selectAllProducts } from '../product.selector';
import { addProduct, deleteProducts, loadProducts, updateProduct } from '../product.action';
import { toSignal } from '@angular/core/rxjs-interop';
import { HttpResponse } from '@angular/common/http';
import { getCurrentUser } from '../../user-page/user.selector';

@Component({
  selector: 'app-product-page',
  imports: [AppGridView, AppCardView, AppDialog, AppForm, AppPagination],
  templateUrl: './product-list-page.html',
  styleUrl: './product-list-page.scss',
  standalone: true
})
export class ProductListPage implements OnInit {
  private store = inject(Store<AppState>);
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  private cartService = inject(CartService);
  private router = inject(Router);
  private toastrService = inject(ToastrService)
  private storageService = inject(StorageService);

  public currentUser = toSignal(this.store.select(getCurrentUser));
  public originalProducts: Product[] = [];
  public isSetOriginalProducts: boolean = false;
  public selectedSortOptions: SortOption<Product>[] = [];
  public storeProducts = toSignal(this.store.select(selectAllProducts), { initialValue: [] });
  public allProducts = signal<Product[]>([]);
  public headers: ColumnDef<Product>[] = [
    {
      field: 'name',
      headerText: 'Product Name',
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
  public titleCreateBtn = BUTTON_TOOLTIP.CREATE_PRODUCT;
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
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
      validator: [Validators.required],
      defaultValue: ''
    },
    {
      name: 'stock',
      label: 'Stock',
      type: 'text',
      validator: [Validators.required],
      defaultValue: 0
    },
    {
      name: 'price',
      label: 'Price',
      type: 'text',
      validator: [Validators.required],
      defaultValue: 0
    },
    {
      name: 'categoryId',
      label: 'Category',
      type: 'select',
      validator: [Validators.required],
      categories: [],
      defaultValue: ''
    },
    {
      name: 'imageUrl',
      label: 'Image',
      type: 'image',
      validator: [Validators.required],
      defaultValue: ''
    }
  ];
  public originalFields: FormFields[] = [];
  public buttonLabel = FORM.SAVE;
  public oldProduct = signal<Product | null>(null);
  public productTemp!: Product;
  public showDialog = signal<boolean>(false);
  public startIndex = signal<number>(1);
  public endIndex = signal<number>(10);
  public quantityItem = signal<number>(10);
  public filteredProducts = computed(() => this.allProducts().slice(this.startIndex() - 1, this.endIndex()));

  constructor() {
    effect(() => {
      if (this.storeProducts().length !== this.allProducts().length) {
        this.allProducts.set(this.storeProducts());
      }

      if (this.currentUser()?.role === 'Admin') {
        this.isCardView.set(false);
      }

      this.setCategories();
      this.setOriginalProducts();
      this.originalFields = this.fields.map(field => ({ ...field }));
    })
  }

  ngOnInit() {
    this.loadProducts();

    const user = this.currentUser();
    this.isCardView.set((!user || user.role === 'User') ? true : false)
  }

  private setCategories() {
    this.fields.find(field => field.name === 'categoryId')!.categories = this.categoryService.categories();
  }

  private setOriginalProducts() {
    if (this.isSetOriginalProducts && this.allProducts().length === 0) return;

    this.originalProducts = [...this.allProducts()];
    this.isSetOriginalProducts = true;
  }

  private loadProducts() {
    this.productService.getAllProductsByConditions().subscribe({
      next: (products: Product[]) => {
        if (products.length === 0) return;

        this.store.dispatch(loadProducts({ products: products }));
      }
    })
  }

  public onClickProduct(productId: string) {
    if (!productId) return;
    this.router.navigate(['/products/detail', productId]);
  }

  public handleActions(event: { action: string, rowData?: Product }) {
    this.productTemp = {...event.rowData};

    const { action, rowData } = event;

    if (!rowData) return;

    if (action === 'delete') {
      this.handleDelete(rowData);
      return;
    }

    if (action === 'edit') {
      this.setForm(rowData);
      this.oldProduct.set(rowData);
      this.showDialog.set(true);
    }
  }

  private handleDelete(product: Product) {
    Swal.fire({
      title: SWAL_MESSAGES.CONFIRM_DELETE_TITLE,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: SWAL_MESSAGES.BUTTON_CONFIRM_ORDER,
      cancelButtonText: SWAL_MESSAGES.BUTTON_CANCEL,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6'
    }).then((result) => {
      if (!result.isConfirmed || !product) return;

      this.productService.deleteProductById(product).subscribe({
        next: ((res: Product) => {
          if (!res) return;

          this.toastrService.success(SUCCESS_MESSAGES.DELETE);
          this.store.dispatch(deleteProducts({ ids: [product.id!] }))
        }),
        error: ((error) => {
          this.toastrService.error(error.message);
        })
      })
    });
  }

  public toggleView(isCardView: boolean) {
    this.isCardView.set(isCardView);
  }

  public toggleDialog() {
    this.setForm(null);
    this.showDialog.set(true);
  }

  public handleEmit(item: { data: Product; action: string }) {
    if (!item || !item.data) return;

    const user = this.currentUser();
    if (!user) {
      this.toastrService.error(ERROR_MESSAGES.LOGIN_REQUIRED);
      return;
    }

    if (user.role !== 'User') {
      this.toastrService.error(ERROR_MESSAGES.PERMISSION_DENIED);
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

        this.toastrService.success(SUCCESS_MESSAGES.ADD_TO_CART);
      },
      complete: () => {
        this.cartService.getCartByCartId();
      }
    });
  }

  private navigateToCheckout(product: Product) {
    const user = this.storageService.getData<User>(STORAGE_KEYS.USER);
    if (!user) {
      this.toastrService.error(ERROR_MESSAGES.LOGIN_REQUIRED);
      return;
    }

    if (!product) return;

    product = { ...product, quantityToBuy: 1 };
    this.storageService.saveData<Product[]>(STORAGE_KEYS.CHECKOUT_PRODUCT_LIST, [product]);

    this.router.navigate(['/checkout'], { state: { fromProductDetailPage: true } });
  }

  public saveProduct(product: Product) {
    if (!product) return;

    if (product.name!.trim() === '') {
      this.toastrService.warning(ERROR_MESSAGES.INVALID_PRODUCT_NAME);
      return;
    }

    if (isNaN(Number(product.price)) || product.price! < 0) {
      this.toastrService.warning(ERROR_MESSAGES.INVALID_PRICE);
      return;
    }

    if (isNaN(Number(product.stock)) || product.stock! < 0) {
      this.toastrService.warning(ERROR_MESSAGES.INVALID_STOCK);
      return;
    }

    const categoryName = this.categoryService.categories().find(category => category.id === product.categoryId)?.name;
    let productToSave: Product = { ...product, categoryName: categoryName!, createdAt: this.productTemp.createdAt };

    this.productService.saveProduct(this.oldProduct()!, productToSave)
      .subscribe({
        next: ((res: HttpResponse<Product>) => {
          if (!res) return;

          this.toastrService.success(SUCCESS_MESSAGES.SAVED_PRODUCT);
          this.showDialog.set(false)

          const product = res.body;
          if (!product) return;

          if (res.status === 200) {
            this.store.dispatch(updateProduct({ product: product }))
          } else if (res.status === 201) {
            this.store.dispatch(addProduct({ product: product }))
          }
        }),
        error: ((error) => {
          this.toastrService.error(error.message);
        })
      })
  }

  private setForm(data: Product | null) {
    this.fields.forEach(field => {
      const value = field.defaultValue;

      if (data) {
        field.defaultValue = data[field.name as keyof Product];
      } else {
        if (typeof value === 'string') {
          field.defaultValue = '';
        } else if (typeof value === 'number') {
          field.defaultValue = 0;
        } else if (typeof value === 'boolean') {
          field.defaultValue = false;
        }
      }
    });
  }


  public handleNavigation(direction: -1 | 1) {
    let quantity = this.quantityItem();
    let total = this.allProducts().length;
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

    let total = this.allProducts().length;
    let quantity = quantityItem > total ? total : quantityItem;

    this.startIndex.set(1);
    this.endIndex.set(quantity)
  }

  public onSort(data: SortOption<Product>) {
    const existing = this.selectedSortOptions.find(item => item.column === data.column);

    let direction = data.direction;
    if (!existing) {
      if (direction !== '') {
        this.selectedSortOptions.push(data);
      }
    } else {
      if (direction !== '') {
        existing.direction = data.direction;
      } else {
        this.selectedSortOptions = this.selectedSortOptions.filter(
          item => item.column !== data.column
        );
      }
    }
    this.selectedSortOptions = this.selectedSortOptions.filter(item => item.direction !== '');

    let sorted = [...this.originalProducts];
    let options = this.selectedSortOptions;

    if (options.length > 0) {
      sorted = sorted.sort((a, b) => {
        for (const { column, direction } of options) {
          const firstValue = a[column as keyof Product];
          const secondValue = b[column as keyof Product];

          if (firstValue == null && secondValue == null) continue;
          if (firstValue == null) return 1;
          if (secondValue == null) return -1;

          let compare = 0;
          let firstNumber = Number(firstValue);
          let secondNumber = Number(secondValue);

          if (Number.isFinite(firstNumber) && Number.isFinite(secondNumber)) {
            compare = firstNumber - secondNumber;
          } else if (typeof firstValue === 'string' && typeof secondValue === 'string') {
            compare = firstValue.localeCompare(secondValue, undefined, { sensitivity: 'base' });
          }

          if (compare !== 0) {
            return direction === 'desc' ? -compare : compare;
          }
        }
        return 0;
      });
    }
    this.allProducts.set(sorted);
  }
}

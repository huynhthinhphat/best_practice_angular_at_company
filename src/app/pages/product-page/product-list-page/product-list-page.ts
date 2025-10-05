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
import { ERROR_MESSAGES, FORM, SUCCESS_MESSAGES, SWAL_MESSAGES } from '../../../shared/constants/message.constants';
import Swal from 'sweetalert2';
import { Validators } from '@angular/forms';
import { AppPagination } from '../../../shared/app-pagination/app-pagination';

@Component({
  selector: 'app-product-page',
  imports: [AppGridView, AppCardView, AppDialog, AppForm, AppPagination],
  templateUrl: './product-list-page.html',
  styleUrl: './product-list-page.scss',
  standalone: true
})
export class ProductListPage implements OnInit {
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  private cartService = inject(CartService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastrService = inject(ToastrService)
  private storageService = inject(StorageService);

  public currentUser = this.authService.currentUser;
  public allProducts = this.productService.products;
  public headers: ColumnDef<Product>[] = [
    {
      headerText: 'Toggle Columns'
    },
    {
      field: 'name',
      headerText: 'Product Name'
    },
    {
      field: 'description',
      headerText: 'Description'
    },
    {
      field: 'stock',
      headerText: 'Stock'
    },
    {
      field: 'price',
      headerText: 'Price',
      pipe: 'currency'
    },
    {
      field: 'categoryName',
      headerText: 'Category Name'
    }
  ];
  public isCardView = signal<boolean>(true);
  public titleGridBtn = "Grid View";
  public titleCardBtn = "Card View";
  public titleCreateBtn = "Create a product";
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
  public showDialog = signal<boolean>(false);

  public startIndex = signal<number>(1);
  public endIndex = signal<number>(10);
  public quantityItem = signal<number>(10);
  public filteredProducts = computed(() => this.allProducts().slice(this.startIndex() - 1, this.endIndex()));

  constructor() {
    effect(() => {
      this.fields.find(field => field.name === 'categoryId')!.categories = this.categoryService.categories();
      this.originalFields = this.fields.map(field => ({ ...field }));
    })
  }

  ngOnInit() {
    this.productService.getAllProductsByConditions();

    const user = this.currentUser();
    if (!user || user.role === 'User') {
      this.isCardView.set(true);
    } else {
      this.isCardView.set(false);
    }
  }

  public onClickProduct(productId: string) {
    if (!productId) return;

    this.router.navigate(['/products/detail', productId]);
  }

  public handleActions(event: { action: string, rowData?: Product }) {
    if (event.action === 'delete') {
      this.handleSoftDeletion(event.rowData!);
      return;
    }

    if (event.action === 'edit') {
      this.fields.forEach(field => {
        field.defaultValue = event.rowData![field.name as keyof Product];
      });
      this.oldProduct.set(event.rowData!);
      this.showDialog.set(true);
      return;
    }
  }

  private handleSoftDeletion(product: Product) {
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
        }),
        error: ((error) => {
          this.toastrService.error(error.message);
        }),
        complete: (() => this.productService.getAllProductsByConditions())
      })
    });
  }

  public toggleView(isCardView: boolean) {
    this.isCardView.set(isCardView);
  }

  public toggleDialog() {
    this.fields = this.originalFields.map(field => ({ ...field }));
    this.showDialog.set(true);
  }

  public handleEmit(item: { data: Product; action: string }) {
    if (!item || !item.data) return;

    const user = this.currentUser();
    if (!user) {
      this.toastrService.error(ERROR_MESSAGES.LOGIN_REQUIRED);
      return;
    }

    if (user.role === 'Admin') {
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
    let productToSave: Product = { ...product, categoryName: categoryName! };

    this.productService.saveProduct(this.oldProduct()!, productToSave)
      .subscribe({
        next: ((res: Product) => {
          if (!res) return;
          this.toastrService.success(SUCCESS_MESSAGES.SAVED_PRODUCT);
          this.showDialog.set(false)
        }),
        error: ((error) => {
          this.toastrService.error(error.message);
        }),
        complete: () => this.productService.getAllProductsByConditions()
      })
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
}

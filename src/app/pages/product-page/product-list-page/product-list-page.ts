import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { ProductService } from '../../../shared/services/product-service/product-service';
import { Router } from '@angular/router';
import { AuthService } from '../../../shared/services/auth-service/auth';
import { AppGridView } from '../../../shared/app-grid-view/app-grid-view';
import { ColumnDef } from '../../../shared/models/column-def.model';
import { Product } from '../../../shared/models/product.model';
import { ToastrService } from 'ngx-toastr';
import { ERROR_MESSAGES, FORM, SUCCESS_MESSAGES, SWAL_MESSAGES } from '../../../shared/constants/message.constants';
import { AppCardView } from '../../../shared/app-card-view/app-card-view';
import { CartService } from '../../../shared/services/cart-service/cart-service';
import { STORAGE_KEYS } from '../../../shared/constants/storage.constants';
import { StorageService } from '../../../shared/services/storage-service/storage-service';
import { User } from '../../../shared/models/user.model';
import { AppDialog } from '../../../shared/app-dialog/app-dialog';
import { AppForm } from '../../../shared/app-form/app-form';
import { FormFields } from '../../../shared/models/form-field.model';
import { CategoryService } from '../../../shared/services/category-service/category-service';
import Swal from 'sweetalert2';
import e from 'express';
import { switchMap, throwError } from 'rxjs';

@Component({
  selector: 'app-product-page',
  imports: [AppGridView, AppCardView, AppDialog, AppForm],
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
  public products = this.productService.products;
  public headers: ColumnDef<Product>[] = [
    { field: 'id', headerText: 'Sku' },
    { field: 'name', headerText: 'Product Name' },
    { field: 'description', headerText: 'Description' },
    { field: 'stock', headerText: 'Stock' },
    { field: 'price', headerText: 'Price', pipe: 'currency' },
    { field: 'categoryName', headerText: 'Category Name' },
  ];
  public isCardView = signal<boolean>(true);
  public titleGridBtn = "Grid View";
  public titleCardBtn = "Card View";
  public titleCreateBtn = "Create a product";
  public fields: FormFields[] = [
    { name: 'id', label: 'id', type: 'text', validator: [], defaultValue: '' },
    { name: 'name', label: 'Name', type: 'text', validator: [], defaultValue: '' },
    { name: 'description', label: 'Description', type: 'textarea', validator: [], defaultValue: '' },
    { name: 'stock', label: 'Stock', type: 'text', validator: [], defaultValue: 0 },
    { name: 'price', label: 'Price', type: 'text', validator: [], defaultValue: 0 },
    { name: 'categoryId', label: 'Category', type: 'select', validator: [], categories: [], defaultValue: '' },
    { name: 'imageUrl', label: 'Image', type: 'image', validator: [], defaultValue: '' }
  ];
  public originalFields: FormFields[] = [];
  public buttonLabel = FORM.SAVE;
  public oldProduct = signal<Product | null>(null);
  public showDialog = signal<boolean>(false);

  constructor() {
    effect(() => {
      this.fields.find(field => field.name === 'categoryId')!.categories = this.categoryService.categories();
      this.originalFields = this.fields.map(field => ({ ...field }));
    })
  }

  public ngOnInit() {
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
    console.log(event)

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

    if(event.action === 'create'){
      this.fields = this.originalFields.map(field => ({ ...field }));
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

  public toggleDialog(){
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
    if (!product || !this.oldProduct()) return;

    if (product.name!.trim() === '') {
      this.toastrService.warning(ERROR_MESSAGES.INVALID_PRODUCT_NAME);
      return;
    }

    if (product.price! < 0) {
      this.toastrService.warning(ERROR_MESSAGES.INVALID_PRICE);
      return;
    }

    if (product.stock! < 0) {
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
}

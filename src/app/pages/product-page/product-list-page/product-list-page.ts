import { Component, inject, OnInit, signal } from '@angular/core';
import { ProductService } from '../../../shared/services/product-service/product-service';
import { NgOptimizedImage } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AppPagination } from '../../../shared/app-pagination/app-pagination';
import { AuthService } from '../../../shared/services/auth-service/auth';
import { AppGridView } from '../../../shared/app-grid-view/app-grid-view';
import { ColumnDef } from '../../../shared/models/column-def.model';
import { Product } from '../../../shared/models/product.model';
import { Actions } from '../../../shared/models/actions.model';
import { ToastrService } from 'ngx-toastr';
import { ERROR_MESSAGES, SUCCESS_MESSAGES, SWAL_MESSAGES } from '../../../shared/constants/message.constants';
import Swal from 'sweetalert2';
import { AppCardView } from '../../../shared/app-card-view/app-card-view';
import { CardDef } from '../../../shared/models/card-def.model';
import { CartService } from '../../../shared/services/cart-service/cart-service';
import { STORAGE_KEYS } from '../../../shared/constants/storage.constants';
import { StorageService } from '../../../shared/services/storage-service/storage-service';
import { User } from '../../../shared/models/user.model';

@Component({
  selector: 'app-product-page',
  imports: [NgOptimizedImage, AppPagination, AppGridView, RouterLink, AppCardView],
  templateUrl: './product-list-page.html',
  styleUrl: './product-list-page.scss',
  standalone: true
})
export class ProductListPage implements OnInit {
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastrService = inject(ToastrService)
  private storageService = inject(StorageService);

  public currentUser = this.authService.currentUser;
  public products = this.productService.products;
  public currentPage = signal<number>(1);
  public headers: ColumnDef<Product>[] = [
    { field: 'id', headerText: 'Sku' },
    { field: 'name', headerText: 'Product Name' },
    { field: 'description', headerText: 'Description' },
    { field: 'stock', headerText: 'Stock' },
    { field: 'price', headerText: 'Price', pipe: 'currency' },
    { field: 'categoryName', headerText: 'Category Name' },
    // {
    //   columnType: "action", actions: [
    //     {
    //       label: 'Edit',
    //       class: 'edit',
    //       icon: 'pi pi-pencil',
    //       tooltip: 'Edit product'
    //     },
    //     {
    //       label: 'Delete',
    //       class: 'delete',
    //       icon: 'pi pi-trash',
    //       tooltip: 'Delete product'
    //     }
    //   ]
    // }
  ];

  public isCardView = signal<boolean>(true);

  public titleGridBtn = "Grid View";
  public titleCardBtn = "Card View";

  public ngOnInit() {
    this.productService.getAllProductsByConditions();

    const user = this.currentUser();
    if (!user || user.role === 'User') {
      this.isCardView.set(true);
      
      const products : CardDef<Product>[] = this.products().map(product => ({ data: product }));
    } else {
      this.isCardView.set(false);
    }
  }

  public onClickProduct(productId: string) {
    if (!productId) return;

    this.router.navigate(['/products/detail', productId]);
  }

  public handlePageChange = (page: number) => {
    this.currentPage.set(page);
    this.productService.getAllProductsByConditions();
  }

  public handleAction(event: { action: Actions<Product>, rowData: Product }) {
    if (event.action.label === 'Edit') {
      this.router.navigate([`/admin/products/edit/${event.rowData.id}`], { state: { isAdmin: true } });
    } else if (event.action.label === 'Delete') {
      this.handleSoftDeletion(event.rowData);
    }
  }

  private handleSoftDeletion(product: Product) {
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
    }else if(item.action === 'buy'){
      this.navigateToCheckout(item.data);
    }
  }

  private addToCart(product : Product) {
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
}

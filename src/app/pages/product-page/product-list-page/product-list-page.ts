import { Component, inject, OnInit, signal } from '@angular/core';
import { ProductService } from '../../../shared/services/product-service/product-service';
import { NgOptimizedImage } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AppPagination } from '../../../shared/app-pagination/app-pagination';
import { AuthService } from '../../../shared/services/auth-service/auth';
import { AppTable } from '../../../shared/app-table/app-table';
import { ColumnDef } from '../../../shared/models/column-def.model';
import { Product } from '../../../shared/models/product.model';
import { Actions } from '../../../shared/models/actions.model';
import { ToastrService } from 'ngx-toastr';
import { SUCCESS_MESSAGES, SWAL_MESSAGES } from '../../../shared/constants/message.constants';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product-page',
  imports: [NgOptimizedImage, AppPagination, AppTable, RouterLink],
  templateUrl: './product-list-page.html',
  styleUrl: './product-list-page.css',
  standalone: true
})
export class ProductListPage implements OnInit {
  private productService = inject(ProductService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastrService = inject(ToastrService)

  public currentUser = this.authService.currentUserSignal;
  public pagination = this.productService.pagination;
  public products = this.productService.products;
  public currentPage = signal<number>(1);
  public headers: ColumnDef<Product>[] = [
    { field: 'id', headerText: 'Sku' },
    { field: 'name', headerText: 'Product Name' },
    { field: 'stock', headerText: 'Stock' },
    { field: 'price', headerText: 'Price' },
    { field: 'categoryName', headerText: 'Category Name' },
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
  ];
  public priceFilter: string[] = [''];

  public ngOnInit() {
    this.productService.getAllProductsByConditions();
  }

  public onClickProduct(productId: string) {
    if (!productId) return;

    this.router.navigate(['/products/detail', productId]);
  }

  public handlePageChange = (page: number) => {
    this.currentPage.set(page);
    this.productService.getAllProductsByConditions(page.toString());
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
}

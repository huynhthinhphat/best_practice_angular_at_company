import { Component, effect, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { OrderService } from '../../../shared/services/order-service/order-service';
import { AppGridView } from '../../../shared/app-grid-view/app-grid-view';
import { CommonModule } from '@angular/common';
import { AppPagination } from '../../../shared/app-pagination/app-pagination';
import { ColumnDef } from '../../../shared/models/column-def.model';
import { Order } from '../../../shared/models/order.model';
import { Actions } from '../../../shared/models/actions.model';
import { AppTabFilter } from '../../../shared/app-tab-filter/app-tab-filter';
import { AuthService } from '../../../shared/services/auth-service/auth';

@Component({
  selector: 'app-order-list-page',
  imports: [ CommonModule, AppPagination, AppTabFilter, AppGridView],
  templateUrl: './order-list-page.html',
  styleUrl: './order-list-page.css',
  standalone: true
})
export class OrderListPage {
  private router = inject(Router);
  private orderService = inject(OrderService);
  private authService = inject(AuthService);

  private currentUser = this.authService.currentUser;
  public pagination = this.orderService.pagination;
  public currentPage = signal<number>(1);
  public orders = this.orderService.orders;
  public selectedStatus = signal<string>('');
  public status: string[] = ['', 'pending', 'processing', 'delivered', 'completed', 'cancelled']
  public headers: ColumnDef<Order>[] = [
    { field: 'username', headerText: 'Username' },
    { field: 'phoneNumber', headerText: 'Phone' },
    { field: 'address', headerText: 'Address' },
    { field: 'quantity', headerText: 'Quantity' },
    { field: 'totalPrice', headerText: 'Total Price' },
    { field: 'status', headerText: 'Status', pipe: 'uppercase' },
    { field: 'createdAt', headerText: 'Created At' },
    { field: 'updatedAt', headerText: 'Updated At' },
    {
      headerText: 'Action', columnType: 'action', actions: [
        {
          label: 'View',
          class: 'view',
          icon: 'pi pi-eye',
          tooltip: 'View order details'
        }
      ]
    }
  ]

  constructor() {
    effect(() => {
      this.getOrdersByConditions();
    })
  }

  public updateStatus(status: string) {
    this.selectedStatus.set(status);
  }

  private getOrdersByConditions() {
    this.orderService.getOrdersByConditions(this.selectedStatus())
  }

  public handlePageChange = (page: number) => {
    this.currentPage.set(page);
    this.orderService.getOrdersByConditions(this.selectedStatus(), page.toString())
  }

  public handleAction(event: { action: Actions<Order>, rowData: Order }) {
    if (this.currentUser()) {
      let basePath = '';

      if (this.currentUser()?.role === 'Admin') {
        basePath = '/admin'
      }

      if (event.action.label === 'View') {
        if (this.currentUser()?.role === 'Admin') {
          this.router.navigate([`${basePath}/orders/detail/${event.rowData.id}`], { state: { isAdmin: true } })
          return;
        }
        this.router.navigate([`${basePath}/orders/detail/${event.rowData.id}`]);
      }
    }
  }
}

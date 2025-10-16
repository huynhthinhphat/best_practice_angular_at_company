import { Component, effect, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { OrderService } from '../../../shared/services/order-service/order-service';
import { CommonModule } from '@angular/common';
import { ColumnDef } from '../../../shared/models/column-def.model';
import { Order } from '../../../shared/models/order.model';
import { AppTabFilter } from '../../../shared/app-tab-filter/app-tab-filter';
import { Store } from '@ngrx/store';
import { AppState } from '../../../state/app.state';
import { toSignal } from '@angular/core/rxjs-interop';
import { getCurrentUser } from '../../../shared/services/user-service/state/user.selector';

@Component({
  selector: 'app-order-list-page',
  imports: [ CommonModule, AppTabFilter ],
  templateUrl: './order-list-page.html',
  styleUrl: './order-list-page.css',
  standalone: true
})
export class OrderListPage {
  private router = inject(Router);
  private orderService = inject(OrderService);
  private store = inject(Store<AppState>);

  private currentUser = toSignal(this.store.select(getCurrentUser));
  public pagination = this.orderService.pagination;
  public currentPage = signal<number>(1);
  public orders = this.orderService.orders;
  public selectedStatus = signal<string>('');
  public status: string[] = ['', 'pending', 'processing', 'delivered', 'completed', 'cancelled']
  public headers: ColumnDef<Order>[] = [
    { field: 'username', headerText: 'Username', isResize: false },
    { field: 'phoneNumber', headerText: 'Phone', isResize: false },
    { field: 'address', headerText: 'Address', isResize: false },
    { field: 'quantity', headerText: 'Quantity', isResize: false },
    { field: 'totalPrice', headerText: 'Total Price', isResize: false },
    { field: 'status', headerText: 'Status', pipe: 'uppercase', isResize: false },
    { field: 'createdAt', headerText: 'Created At', isResize: false },
    { field: 'updatedAt', headerText: 'Updated At', isResize: false },
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

  public handleAction(event: { action: string, rowData: Order }) {
    if (this.currentUser()) {
      let basePath = '';

      if (this.currentUser()?.role === 'Admin') {
        basePath = '/admin'
      }

      if (event.action === 'View') {
        if (this.currentUser()?.role === 'Admin') {
          this.router.navigate([`${basePath}/orders/detail/${event.rowData.id}`], { state: { isAdmin: true } })
          return;
        }
        this.router.navigate([`${basePath}/orders/detail/${event.rowData.id}`]);
      }
    }
  }
}

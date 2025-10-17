import { Component, inject, input, output } from '@angular/core';
import { Order } from '../models/order.model';
import { StatusIcon } from '../directives/status-icon/status-icon';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { OrderDetail } from '../models/order-detail.model';
import { ORDER_STATUS } from '../constants/order-status.constants';
import { Location } from '@angular/common';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { selectCurrentUser } from '../services/user-service/state/user.selector';

@Component({
  selector: 'app-order-detail',
  imports: [StatusIcon, CurrencyPipe, DatePipe],
  templateUrl: './app-order-detail.html',
  styleUrl: './app-order-detail.css'
})
export class AppOrderDetail {
  private store = inject(Store);
  private location = inject(Location);

  public currentUser = toSignal(this.store.select(selectCurrentUser));
  public order = input<Order | null>(null);
  public orderDetail = input<OrderDetail[]>([]);
  public handleStatusOrder = output<string>();
  public readonly status = ORDER_STATUS;

  public updateOrderStatus(status: string) {
    this.handleStatusOrder.emit(status);
  }

  public goBack() {
    this.location.back();
  }
}

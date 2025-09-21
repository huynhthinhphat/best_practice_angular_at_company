import { Component, inject, OnInit, signal } from '@angular/core';
import { OrderService } from '../../../shared/services/order-service/order-service';
import { ActivatedRoute } from '@angular/router';
import { Order } from '../../../shared/models/order.model';
import { OrderDetail } from '../../../shared/models/order-detail.model';
import { ToastrService } from 'ngx-toastr';
import { ERROR_MESSAGES, SUCCESS_MESSAGES, SWAL_MESSAGES } from '../../../shared/constants/message.constants';
import Swal from 'sweetalert2';
import { AppOrderDetail } from '../../../shared/app-order-detail/app-order-detail';

@Component({
  selector: 'app-order-detail-page',
  imports: [AppOrderDetail],
  templateUrl: './order-detail-page.html',
  styleUrl: './order-detail-page.css'
})
export class OrderDetailPage implements OnInit {
  private orderService = inject(OrderService);
  private route = inject(ActivatedRoute);
  private toastrService = inject(ToastrService);

  public order = signal<Order | null>(null);
  public orderDetail = signal<OrderDetail[]>([]);

  public ngOnInit() {
    this.loadOrderDetail();
  }

  private loadOrderDetail() {
    const order = this.route.snapshot.data['order'];
    const orderDetail = this.route.snapshot.data['orderDetail'];

    if (!order || !orderDetail) return;

    this.order.set(order);
    this.orderDetail.set(orderDetail);
  }

  public updateOrderStatus(status: string) {
    Swal.fire({
      title: SWAL_MESSAGES.CONFIRM_UPDATE_ORDER_TITLE,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: SWAL_MESSAGES.BUTTON_CONFIRM_ORDER,
      cancelButtonText: SWAL_MESSAGES.BUTTON_CANCEL,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6'
    }).then((result) => {
      if (!result.isConfirmed || !this.order() || !status) return;

      this.orderService.updateOrderStatus(this.order()!, status).subscribe({
        next: (order) => {
          if (!order) return;

          this.order.set(order);
          this.toastrService.success(SUCCESS_MESSAGES.UPDATE_ORDER);
        },
        error: () => {
          this.toastrService.error(ERROR_MESSAGES.UPDATE_ORDER_FAILED);
        }
      });
    });
  }
}

import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { catchError, EMPTY } from 'rxjs';
import { OrderService } from '../../services/order-service/order-service';
import { OrderDetail } from '../../models/order-detail.model';

export const orderDetailResolver: ResolveFn<OrderDetail[]> = (route) => {
  const router = inject(Router);
  const orderService = inject(OrderService);
  const orderId = route.params['orderId'];

  return orderService.getOrderDetailByOrderId(orderId).pipe(
    catchError(() => {
      router.navigate(['/not-found']);
      return EMPTY;
    })
  );
};

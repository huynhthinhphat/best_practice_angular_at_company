import { ResolveFn, Router } from '@angular/router';
import { Order } from '../../models/order.model';
import { inject } from '@angular/core';
import { OrderService } from '../../services/order-service/order-service';
import { catchError, EMPTY } from 'rxjs';

export const orderResolver: ResolveFn<Order> = (route) => {
  const router = inject(Router);
  const orderService = inject(OrderService);
  const orderId = route.params['orderId'];

  return orderService.getOrderByOrderId(orderId).pipe(
    catchError(() => {
      router.navigate(['/not-found']);
      return EMPTY;
    })
  );
};

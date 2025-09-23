import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Order } from '../../models/order.model';
import { Product } from '../../models/product.model';
import { forkJoin, map, Observable, switchMap, throwError } from 'rxjs';
import { ORDER_DETAIL_URL, ORDER_URL } from '../../constants/url.constants';
import { OrderDetail } from '../../models/order-detail.model';
import { StorageService } from '../storage-service/storage-service';
import { STORAGE_KEYS } from '../../constants/storage.constants';
import { ERROR_MESSAGES } from '../../constants/message.constants';
import { PaginationResponse } from '../../models/pagination-response.model';
import { User } from '../../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private http = inject(HttpClient);
  private storageService = inject(StorageService);

  public pagination = signal<PaginationResponse<Order> | null>(null);
  public orders = signal<Order[]>([]);

  public createOrder(order: Order): Observable<Order> {
    if (!order) return throwError(() => new Error(ERROR_MESSAGES.CREATE_CART_FAILED));

    return this.http.post<Order>(ORDER_URL, order).pipe(
      switchMap(order => {
        if (!order) return throwError(() => new Error(ERROR_MESSAGES.CREATE_CART_FAILED));

        const products = this.storageService.getData<Product[]>(STORAGE_KEYS.CHECKOUT_PRODUCT_LIST);
        if (!products || products.length === 0) return throwError(() => new Error(ERROR_MESSAGES.CREATE_CART_FAILED));

        const orderDetailRequest = products.map(product => {
          const orderDetail: OrderDetail = {
            product: product,
            orderId: order.id,
            quantity: product.quantityToBuy,
            totalPrice: product.quantityToBuy! * product.price!
          };

          return this.http.post<OrderDetail>(ORDER_DETAIL_URL, orderDetail);
        })

        return forkJoin(orderDetailRequest).pipe(map(() => order));
      })
    );
  }

  public getOrdersByConditions(status: string, page: string = '1') {
    const user = this.storageService.getData<User>(STORAGE_KEYS.USER);
    if (!user) return;

    const userId = user.role === 'User' ? user.id! : '';

    const params = new HttpParams().set('userId', userId).set('status', status).set('_page', page);
    this.http.get<PaginationResponse<Order>>(ORDER_URL, { params }).subscribe({
      next: (res: PaginationResponse<Order>) => {
        if (!res) return;

        this.pagination.set(res);
        this.orders.set(res.data);
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  public getOrderByOrderId(orderId: string): Observable<Order> {
    return this.http.get<Order>(`${ORDER_URL}/${orderId}`);
  }

  public getOrderDetailByOrderId(orderId: string): Observable<OrderDetail[]> {
    const params = new HttpParams().set('orderId', orderId);
    return this.http.get<OrderDetail[]>(ORDER_DETAIL_URL, { params });
  }

  public updateOrderStatus(order: Order, status: string): Observable<Order> {
    if (!order || !status) return throwError(() => new Error(ERROR_MESSAGES.UPDATE_ORDER_FAILED));

    const updatedOrder: Order = { ...order, status: status, updatedAt: new Date() };
    return this.http.patch<Order>(`${ORDER_URL}/${order.id}`, updatedOrder);
  }
}

import { HttpClient, HttpParams } from '@angular/common/http';
import { effect, inject, Injectable, signal } from '@angular/core';
import { forkJoin, Observable, tap, throwError } from 'rxjs';
import { CART_ITEMS_URL, CART_URL } from '../../constants/url.constants';
import { Cart } from '../../models/cart.model';
import { CartItem } from '../../models/cart-item.model';
import { StorageService } from '../storage-service/storage-service';
import { STORAGE_KEYS } from '../../constants/storage.constants';
import { Product } from '../../models/product.model';
import { User } from '../../models/user.model';
import { ERROR_MESSAGES } from '../../constants/message.constants';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private http = inject(HttpClient);
  private storageService = inject(StorageService);

  public quantityItems = signal<number>(0);
  public cartItems = signal<CartItem[]>([]);
  public totalPrice = signal<number>(0);

  constructor() {
    effect(() => {
      const currentQuantityItems = this.quantityItems();
      const user = this.storageService.getData(STORAGE_KEYS.USER);

      if (user) {
        this.storageService.saveData(STORAGE_KEYS.USER, { ...user, quantityItems: currentQuantityItems });
      }
    })
  }

  public getCartItemsByCartId(cartId: string): Observable<Cart[]> {
    const params = new HttpParams().set('cartId', cartId);
    return this.http.get<Cart[]>(`${CART_ITEMS_URL}`, { params });
  }

  public deleteCartItems(selectedItemIdList: string[]): Observable<CartItem[]> {
    if (!selectedItemIdList || selectedItemIdList.length === 0) return throwError(() => new Error(ERROR_MESSAGES.NO_PRODUCT_TO_DELETE));

    const selectedItemIdReq = selectedItemIdList.map(item => {
      return this.http.delete<CartItem>(`${CART_ITEMS_URL}/${item}`);
    })

    return forkJoin(selectedItemIdReq)
      .pipe(
        tap(() => {
          this.cartItems.update(items => items.filter(item => !selectedItemIdList.includes(item.id!)));
          this.setTotalPrice();

          this.storageService.saveData<CartItem[]>(STORAGE_KEYS.CART_ITEMS, this.cartItems());
          this.quantityItems.update(val => val - selectedItemIdList.length);
        })
      )
  }

  public handleCartItemToUpdate(product: Product, quantityChange: number): Observable<CartItem> {
    const user = this.storageService.getData<User>(STORAGE_KEYS.USER);
    if (!user) return throwError(() => new Error(ERROR_MESSAGES.LOGIN_REQUIRED));
    if (!user.cartId) return throwError(() => new Error(ERROR_MESSAGES.NOT_FOUND_CART));

    const cartItem = this.findCartItem(user, product);
    if (!cartItem) {
      const data: CartItem = {
        cartId: user.cartId,
        product: product,
        quantity: quantityChange
      }
      return this.http.post<CartItem>(`${CART_ITEMS_URL}`, data);
    }

    if (quantityChange > 0) {
      return this.http.put<CartItem>(`${CART_ITEMS_URL}/${cartItem.id}`, { ...cartItem, quantity: (cartItem.quantity || 0) + quantityChange });
    }

    return throwError(() => new Error(ERROR_MESSAGES.UPDATE_CART_FAILED));
  }

  private findCartItem(user: User, product: Product): CartItem | undefined {
    return this.cartItems().find(item => (item.product?.id === product.id && item.cartId === user.cartId));
  }

  public updateCartItemQuantity(cartItem: CartItem, newQuantity: number): Observable<CartItem> {
    const updatedCartItem = { ...cartItem, quantity: newQuantity };
    return this.http.put<CartItem>(`${CART_ITEMS_URL}/${cartItem.id}`, updatedCartItem);
  }

  public getCartByCartId() {
    const cartId = this.storageService.getData<User>(STORAGE_KEYS.USER)?.cartId;
    if (!cartId) return;

    const params = new HttpParams().set('cartId', cartId);
    this.http.get<CartItem[]>(`${CART_ITEMS_URL}`, { params }).subscribe({
      next: (cartItems) => {
        if (cartItems) {
          this.cartItems.set([...cartItems]);
          this.refreshCart();
        }
      }
    });
  }

  public setTotalPrice() {
    const totalPrice = this.cartItems().reduce((total, item) => total + (item.product?.price || 0) * (item.quantity || 0), 0);
    this.totalPrice.set(totalPrice);
  }

  public refreshCart() {
    this.quantityItems.set(this.cartItems().length);
    this.setTotalPrice();
    this.storageService.saveData<CartItem[]>(STORAGE_KEYS.CART_ITEMS, this.cartItems());
  }

  public generateCart(user: User): Observable<Cart> {
    if (!user) return throwError(() => { new Error(ERROR_MESSAGES.CREATE_CART_FAILED) });

    const cart: Cart = { userId: user.id, totalPrice: 0 };
    return this.http.post<Cart>(CART_URL, cart);
  }

  public setCartId() {
    let user = this.storageService.getData<User>(STORAGE_KEYS.USER);
    if (!user) return;
    
    const params = new HttpParams().set('userId', user.id!);
    this.http.get<Cart[]>(CART_URL, { params }).subscribe({
      next: ((carts: Cart[]) => {
        if (carts.length === 0) return;

        user = { ...user!, cartId: carts[0].id };
        this.storageService.saveData<User>(STORAGE_KEYS.USER, user);
      })
    })
  }
}

import { HttpClient, HttpParams } from '@angular/common/http';
import { effect, inject, Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CART_ITEMS_URL } from '../../constants/url.constants';
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

  constructor(){
    effect(() => {
      const currentQuantityItems = this.quantityItems();
      const user = this.storageService.getData(STORAGE_KEYS.USER);
      if(user){
        this.storageService.saveData(STORAGE_KEYS.USER, { ...user, quantityItems: currentQuantityItems });
      }
    })
  }

  public getCartItemsByCartId(cartId: string): Observable<Cart[]> {
    const params = new HttpParams().set('cartId', cartId);
    return this.http.get<Cart[]>(`${CART_ITEMS_URL}`, { params });
  }

  public deleteCartItem(selectedItemId: string): Observable<CartItem> {
    return this.http.delete<CartItem>(`${CART_ITEMS_URL}/${selectedItemId}`);
  }

  public handleCartItemToUpdate(product : Product, quantityChange: number): Observable<CartItem> {
    const user = this.storageService.getData(STORAGE_KEYS.USER) as User;
    if(!user) throw new Error(ERROR_MESSAGES.NOT_FOUND_ACCOUNT);
    if(!user.cartId) throw new Error(ERROR_MESSAGES.NOT_FOUND_CART);

    const cartItem = this.findCartItem(user, product);
    if(!cartItem){
      const data : CartItem = {
        cartId: user.cartId,
        product: product,
        quantity: 1
      }
      return this.http.post<CartItem>(`${CART_ITEMS_URL}`, data );
    }
    
    if(quantityChange > 0){
      return this.http.put<CartItem>(`${CART_ITEMS_URL}/${cartItem.id}`, { ...cartItem, quantity: quantityChange });
    }

    return of();
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
        if(cartItems){
          this.cartItems.set([...cartItems]);
          this.refreshCart();
        }
      },
      error: (error) => {
        console.error(error.message);
      }
    });
  }

  public setTotalPrice(){
    const totalPrice = this.cartItems().reduce((total, item) => total + (item.product?.price || 0) * (item.quantity || 0), 0);
    this.totalPrice.set(totalPrice);
  }

  public refreshCart(){
    this.quantityItems.set(this.cartItems().length); 
    this.setTotalPrice();
    this.storageService.saveData<CartItem[]>(STORAGE_KEYS.CART_ITEMS, this.cartItems());
  }
}

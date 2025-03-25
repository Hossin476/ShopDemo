import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartItem } from '../models/cart.type';
import { Product } from '../models/product.type';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  cartItems$ = this.cartItemsSubject.asObservable();

  addToCart(product: Product, quantity: number = 1): void {
    const currentItems = this.cartItemsSubject.value;
    const itemIndex = currentItems.findIndex(
      (item) => item.product.id === product.id
    );

    if (itemIndex > -1) {
      currentItems[itemIndex].quantity += quantity;
    } else {
      currentItems.push({ product, quantity });
    }

    this.cartItemsSubject.next(currentItems);
  }

  removeFromCart(productId: number): void {
    const currentItems = this.cartItemsSubject.value.filter(
      (item) => item.product.id !== productId
    );
    this.cartItemsSubject.next(currentItems);
  }

  clearCart(): void {
    this.cartItemsSubject.next([]);
  }

  updateCartItemQuantity(productId: number, newQuantity: number): void {
    const currentItems = this.cartItemsSubject.value;
    const itemIndex = currentItems.findIndex(
      (item) => item.product.id === productId
    );

    if (itemIndex > -1) {
      currentItems[itemIndex].quantity = newQuantity;
      this.cartItemsSubject.next(currentItems);
    }
  }
}
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

  constructor() {
    // Initialize from localStorage on service creation
    const storedCartItems = localStorage.getItem('cartItems');
    if (storedCartItems) {
      this.cartItemsSubject.next(JSON.parse(storedCartItems));
    }

    // Sync with localStorage whenever cart changes
    this.cartItemsSubject.subscribe(cartItems => {
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
    });
  }

  addToCart(product: Product, quantity: number = 1): void {
    const currentItems = [...this.cartItemsSubject.value];
    const itemIndex = currentItems.findIndex(
      (item) => item.product.id === product.id
    );

    if (itemIndex > -1) {
      currentItems[itemIndex] = {
        ...currentItems[itemIndex],
        quantity: currentItems[itemIndex].quantity + quantity
      };
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
    localStorage.removeItem('cartItems');
  }

  updateCartItemQuantity(productId: number, newQuantity: number): void {
    const currentItems = [...this.cartItemsSubject.value];
    const itemIndex = currentItems.findIndex(
      (item) => item.product.id === productId
    );

    if (itemIndex > -1) {
      if (newQuantity > 0) {
        currentItems[itemIndex] = {
          ...currentItems[itemIndex],
          quantity: newQuantity
        };
      } else {
        // Remove item if quantity is 0 or negative
        currentItems.splice(itemIndex, 1);
      }
      this.cartItemsSubject.next(currentItems);
    }
  }

  getCartItemCount(): number {
    return this.cartItemsSubject.value.reduce((total, item) => total + item.quantity, 0);
  }

  getTotalCartValue(): number {
    return this.cartItemsSubject.value.reduce((total, item) => 
      total + (item.product.price * item.quantity), 0);
  }
}
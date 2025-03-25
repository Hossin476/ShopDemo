import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';
import type { CartItem } from '../../models/cart.type';
import {
  LucideAngularModule,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
} from 'lucide-angular';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './cart.component.html',
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];

  trashIcon = Trash2;
  plusIcon = Plus;
  minusIcon = Minus;
  bagIcon = ShoppingBag;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.cartService.cartItems$.subscribe((items) => {
      this.cartItems = items;
    });
  }

  get subtotal(): number {
    return this.cartItems.reduce((sum, item) => {
      const price = item.product.discountPrice || item.product.price;
      return sum + price * item.quantity;
    }, 0);
  }

  get tax(): number {
    return this.subtotal * 0.08;
  }

  get total(): number {
    return this.subtotal + this.tax;
  }

  get itemCount(): number {
    return this.cartItems.reduce((count, item) => count + item.quantity, 0);
  }

  updateQuantity(item: CartItem, newQuantity: number): void {
    if (newQuantity <= 0) {
      this.removeItem(item.product.id);
      return;
    }

    this.cartService.updateCartItemQuantity(item.product.id, newQuantity);
  }

  removeItem(productId: number): void {
    this.cartService.removeFromCart(productId);
  }

  clearCart(): void {
    this.cartService.clearCart();
  }
}
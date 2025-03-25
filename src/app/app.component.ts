import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from './services/cart.service';
import { Subscription } from 'rxjs';

import {
  LucideAngularModule,
  Package,
  ShoppingCart
} from 'lucide-angular';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    LucideAngularModule
  ],
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit, OnDestroy {
  packagesIcon = Package;
  cartIcon = ShoppingCart;
  cartItemCount = 0;
  private cartSubscription: Subscription | undefined;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.cartSubscription = this.cartService.cartItems$.subscribe(() => {
      this.cartItemCount = this.cartService.getCartItemCount();
    });
  }

  ngOnDestroy(): void {
    this.cartSubscription?.unsubscribe();
  }
}
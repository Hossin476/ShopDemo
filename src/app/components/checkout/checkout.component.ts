import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { CartItem } from '../../models/cart.type';
import {
  Order,
  OrderItem,
  Address,
  PaymentMethod,
} from '../../models/order.type';
import { LucideAngularModule, CreditCard, Check } from 'lucide-angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    LucideAngularModule,
  ],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit, OnDestroy {
  cartItems: CartItem[] = [];
  checkoutForm: FormGroup;
  orderPlaced = false;
  creditCardIcon = CreditCard;
  checkIcon = Check;
  private cartSubscription: Subscription | null = null;

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private fb: FormBuilder
  ) {
    this.checkoutForm = this.fb.group({
      personalInfo: this.fb.group({
        firstName: ['', [Validators.required]],
        lastName: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
      }),
      shippingAddress: this.fb.group({
        address: ['', [Validators.required]],
        city: ['', [Validators.required]],
        state: ['', [Validators.required]],
        zipCode: [
          '',
          [Validators.required, Validators.pattern(/^\d{5}(-\d{4})?$/)],
        ],
      }),
      paymentInfo: this.fb.group({
        cardName: ['', [Validators.required]],
        cardNumber: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
        expiryDate: [
          '',
          [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)],
        ],
        cvv: ['', [Validators.required, Validators.pattern(/^\d{3,4}$/)]],
      }),
    });
  }

  ngOnInit(): void {
    this.cartSubscription = this.cartService.cartItems$.subscribe((items) => {
      this.cartItems = items;
    });
  }

  ngOnDestroy(): void {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
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

  get shipping(): number {
    return this.subtotal > 100 ? 0 : 10;
  }

  get total(): number {
    return this.subtotal + this.tax + this.shipping;
  }

  get itemCount(): number {
    return this.cartItems.reduce((count, item) => count + item.quantity, 0);
  }

  onSubmit(): void {
    if (this.checkoutForm.valid) {
      const orderItems: OrderItem[] = this.cartItems.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        quantity: item.quantity,
        unitPrice: item.product.discountPrice || item.product.price,
        subtotal:
          (item.product.discountPrice || item.product.price) * item.quantity,
      }));
      const shippingAddress: Address = {
        fullName: `${this.checkoutForm.get('personalInfo.firstName')?.value} ${
          this.checkoutForm.get('personalInfo.lastName')?.value
        }`,
        streetAddress: this.checkoutForm.get('shippingAddress.address')?.value,
        city: this.checkoutForm.get('shippingAddress.city')?.value,
        state: this.checkoutForm.get('shippingAddress.state')?.value,
        zipCode: this.checkoutForm.get('shippingAddress.zipCode')?.value,
        country: 'United States',
        phoneNumber: '',
        isDefault: false,
      };
      const paymentMethod: PaymentMethod = {
        type: 'creditCard',
        cardNumber: this.checkoutForm.get('paymentInfo.cardNumber')?.value,
        nameOnCard: this.checkoutForm.get('paymentInfo.cardName')?.value,
        expirationDate: this.checkoutForm.get('paymentInfo.expiryDate')?.value,
        cvv: this.checkoutForm.get('paymentInfo.cvv')?.value,
      };
      const order: Order = {
        id: 0,
        items: orderItems,
        shippingAddress: shippingAddress,
        billingAddress: shippingAddress,
        paymentMethod: paymentMethod,
        subtotal: this.subtotal,
        shippingCost: this.shipping,
        tax: this.tax,
        total: this.total,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      this.orderService.placeOrder(order).subscribe({
        next: (response) => {
          console.log('Order placed successfully', response);
          this.cartService.clearCart();
          this.orderPlaced = true;
        },
        error: (error) => {
          console.error('Error placing order', error);
        },
      });
    } else {
      this.markFormGroupTouched(this.checkoutForm);
    }
  }

  markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();

      if ((control as FormGroup).controls) {
        this.markFormGroupTouched(control as FormGroup);
      }
    });
  }
}

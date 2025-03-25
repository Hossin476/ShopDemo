import { Component, OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms"
import { CartService } from "../../services/cart.service"
import { CartItem } from "../../models/cart.type"
import { LucideAngularModule, CreditCard, Check } from "lucide-angular"

@Component({
  selector: "app-checkout",
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, LucideAngularModule],
  providers: [CartService], // Add CartService to providers
  templateUrl: "./checkout.component.html",
  styleUrls: ["./checkout.component.css"],
})
export class CheckoutComponent implements OnInit {
  cartItems: CartItem[] = []
  checkoutForm: FormGroup
  orderPlaced = false

  // Lucide icons
  creditCardIcon = CreditCard
  checkIcon = Check

  constructor(
    private cartService: CartService,
    private fb: FormBuilder,
  ) {
    this.checkoutForm = this.fb.group({
      personalInfo: this.fb.group({
        firstName: ["", [Validators.required]],
        lastName: ["", [Validators.required]],
        email: ["", [Validators.required, Validators.email]],
      }),
      shippingAddress: this.fb.group({
        address: ["", [Validators.required]],
        city: ["", [Validators.required]],
        state: ["", [Validators.required]],
        zipCode: ["", [Validators.required, Validators.pattern(/^\d{5}(-\d{4})?$/)]],
      }),
      paymentInfo: this.fb.group({
        cardName: ["", [Validators.required]],
        cardNumber: ["", [Validators.required, Validators.pattern(/^\d{16}$/)]],
        expiryDate: ["", [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)]],
        cvv: ["", [Validators.required, Validators.pattern(/^\d{3,4}$/)]],
      }),
    })
  }

  ngOnInit(): void {
    this.cartService.cartItems$.subscribe((items) => {
      this.cartItems = items
    })
  }

  get subtotal(): number {
    return this.cartItems.reduce((sum, item) => {
      const price = item.product.discountPrice || item.product.price
      return sum + price * item.quantity
    }, 0)
  }

  get tax(): number {
    return this.subtotal * 0.08 // 8% tax rate
  }

  get shipping(): number {
    return this.subtotal > 100 ? 0 : 10 // Free shipping over $100
  }

  get total(): number {
    return this.subtotal + this.tax + this.shipping
  }

  get itemCount(): number {
    return this.cartItems.reduce((count, item) => count + item.quantity, 0)
  }

  onSubmit(): void {
    if (this.checkoutForm.valid) {
      // In a real app, you would send the order to your backend here
      console.log("Order submitted:", {
        items: this.cartItems,
        customerInfo: this.checkoutForm.value,
        total: this.total,
      })

      // Show order confirmation
      this.orderPlaced = true

      // Clear the cart
      this.cartService.clearCart()
    } else {
      // Mark all fields as touched to show validation errors
      this.markFormGroupTouched(this.checkoutForm)
    }
  }

  // Helper method to mark all form controls as touched
  markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched()

      if ((control as FormGroup).controls) {
        this.markFormGroupTouched(control as FormGroup)
      }
    })
  }
}
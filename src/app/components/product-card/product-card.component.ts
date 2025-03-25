import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  LucideAngularModule,
  Star,
  StarHalf,
  StarOff,
  ShoppingCart,
  Tag,
  Award,
  Check,
} from 'lucide-angular';
import type { Product } from '../../models/product.type';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [
    CommonModule,
    LucideAngularModule
  ],
  templateUrl: './product-card.component.html',
})
export class ProductCardComponent {
  @Input() product!: Product;
  @Input() isAddedToCart: boolean = false;
  @Output() addToCart = new EventEmitter<void>();
  @Output() productSelected = new EventEmitter<number>();

  starIcon = Star;
  starHalfIcon = StarHalf;
  starOffIcon = StarOff;
  cartIcon = ShoppingCart;
  tagIcon = Tag;
  awardIcon = Award;
  checkIcon = Check;

  generateStars(rating: number): number[] {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return [
      ...Array(fullStars).fill(1),
      ...(hasHalfStar ? [0.5] : []),
      ...Array(emptyStars).fill(0),
    ];
  }

  onAddToCart(event: Event): void {
    event.stopPropagation();
    this.addToCart.emit();
  }

  onProductSelect(): void {
    this.productSelected.emit(this.product.id);
  }
}
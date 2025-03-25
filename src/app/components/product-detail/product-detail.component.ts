import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product.type';
import {
  LucideAngularModule,
  Star,
  StarHalf,
  StarOff,
  ShoppingCart,
  Tag
} from 'lucide-angular';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    CommonModule, 
    LucideAngularModule
  ],
  templateUrl: './product-detail.component.html'
})
export class ProductDetailComponent implements OnInit {
  product: Product | undefined;

  starIcon = Star;
  starHalfIcon = StarHalf;
  starOffIcon = StarOff;
  cartIcon = ShoppingCart;
  tagIcon = Tag;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.productService.getProductById(+productId).subscribe((product) => {
        this.product = product;
      });
    }
  }

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

  addToCart(product: Product): void {
    this.cartService.addToCart(product, 1);
  }
}
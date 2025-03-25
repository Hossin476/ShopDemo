import { Component, type OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { PaginationComponent } from '../pagination/pagination.component';
import type { Product } from '../../models/product.type';
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

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, PaginationComponent],
  providers: [ProductService, CartService],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit {
  allProducts: Product[] = [];
  products: Product[] = [];
  activeImageIndex: { [key: number]: number } = {};
  addedToCart: { [key: number]: boolean } = {};

  // Pagination
  currentPage = 1;
  itemsPerPage = 6;
  totalItems = 0;
  totalPages = 0;

  // Import Lucide icons for use in the template
  starIcon = Star;
  starHalfIcon = StarHalf;
  starOffIcon = StarOff;
  cartIcon = ShoppingCart;
  tagIcon = Tag;
  awardIcon = Award;
  checkIcon = Check;

  constructor(
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe((products) => {
      this.allProducts = products;
      this.totalItems = products.length;
      this.updateDisplayedProducts();
      this.updateTotalPages();

      // Initialize active image index for each product
      products.forEach((product) => {
        this.activeImageIndex[product.id] = 0;
        this.addedToCart[product.id] = false;
      });
    });
  }

  updateDisplayedProducts(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.products = this.allProducts.slice(startIndex, endIndex);
  }

  updateTotalPages(): void {
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.updateDisplayedProducts();
    // Scroll to top of product list
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Method to generate an array of stars based on rating
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

  // Method to add a product to the cart
  addToCart(product: Product): void {
    this.cartService.addToCart(product, 1);

    // Show added feedback temporarily
    this.addedToCart[product.id] = true;
    setTimeout(() => {
      this.addedToCart[product.id] = false;
    }, 1500);
  }
}
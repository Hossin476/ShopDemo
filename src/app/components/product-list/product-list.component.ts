import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { PaginationComponent } from '../pagination/pagination.component';
import { FilterComponent } from '../filter/filter.component';
import { ProductCardComponent } from '../product-card/product-card.component';
import type { Product } from '../../models/product.type';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    LucideAngularModule,
    PaginationComponent,
    FilterComponent,
    ProductCardComponent,
  ],
  templateUrl: './product-list.component.html',
})
export class ProductListComponent implements OnInit {
  allProducts: Product[] = [];
  filteredProducts: Product[] = [];
  products: Product[] = [];
  addedToCart: { [key: number]: boolean } = {};

  currentPage = 1;
  itemsPerPage = 6;
  totalPages = 0;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe((products) => {
      this.allProducts = products;
      this.filteredProducts = products;
      this.updateDisplayedProducts();
      this.updateTotalPages();
      products.forEach((product) => {
        this.addedToCart[product.id] = false;
      });
    });
  }

  onFiltersChanged(filters: any): void {
    this.filteredProducts = this.allProducts.filter((product) => {
      const categoryMatch =
        filters.categories.length === 0 ||
        filters.categories.includes(product.category);

      const priceMatch =
        product.price >= filters.minPrice && product.price <= filters.maxPrice;

      const ratingMatch = product.rating >= filters.rating;

      return categoryMatch && priceMatch && ratingMatch;
    });

    this.currentPage = 1;
    this.updateDisplayedProducts();
    this.updateTotalPages();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.updateDisplayedProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  navigateToProductDetail(productId: number): void {
    this.router.navigate(['/products', productId]);
  }

  updateDisplayedProducts(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.products = this.filteredProducts.slice(startIndex, endIndex);
  }

  updateTotalPages(): void {
    this.totalPages = Math.ceil(
      this.filteredProducts.length / this.itemsPerPage
    );
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product, 1);
    this.addedToCart[product.id] = true;
    setTimeout(() => {
      this.addedToCart[product.id] = false;
    }, 2500);
  }
}

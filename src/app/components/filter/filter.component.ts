import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Filter, X, ChevronDown } from 'lucide-angular';

interface FilterOptions {
  categories: string[];
  minPrice: number;
  maxPrice: number;
  rating: number;
}

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css'],
})
export class FilterComponent implements OnInit {
  @Output() filtersChanged = new EventEmitter<FilterOptions>();

  filterIcon = Filter;
  clearIcon = X;
  chevronDownIcon = ChevronDown;

  uniqueCategories: string[] = [
    'accessories',
    'electronics',
    'home',
    'clothing',
  ];
  selectedCategories: { [key: string]: boolean } = {};
  priceRange = { min: null, max: null };
  selectedRating = 0;

  constructor() {}

  ngOnInit(): void {}

  applyFilters(): void {
    const filterOptions: FilterOptions = {
      categories: Object.keys(this.selectedCategories).filter(
        (category) => this.selectedCategories[category]
      ),
      minPrice: this.priceRange.min ?? 0,
      maxPrice: this.priceRange.max ?? Number.MAX_SAFE_INTEGER,
      rating: this.selectedRating,
    };

    this.filtersChanged.emit(filterOptions);
  }

  resetFilters(): void {
    this.selectedCategories = {};
    this.priceRange = { min: null, max: null };
    this.selectedRating = 0;
    this.applyFilters();
  }

  hasActiveFilters(): boolean {
    return (
      Object.keys(this.selectedCategories).length > 0 ||
      this.priceRange.min !== null ||
      this.priceRange.max !== null ||
      this.selectedRating > 0
    );
  }
}

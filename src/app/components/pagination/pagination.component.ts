import { Component, EventEmitter, Input, Output, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, ChevronLeft, ChevronRight } from 'lucide-angular';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css'],
})
export class PaginationComponent implements OnChanges {
  @Input() currentPage = 1;
  @Input() totalPages = 1;
  @Input() itemsPerPage = 6;
  @Input() totalItems = 0;

  @Output() pageChange = new EventEmitter<number>();

  // Lucide icons
  chevronLeftIcon = ChevronLeft;
  chevronRightIcon = ChevronRight;

  startItem!: number;
  endItem!: number;

  ngOnChanges() {
    this.calculatePagination();
  }

  calculatePagination() {
    this.startItem = ((this.currentPage - 1) * this.itemsPerPage) + 1;
    this.endItem = Math.min(this.currentPage * this.itemsPerPage, this.totalItems);
  }

  // Generate an array of page numbers to display
  get pages(): number[] {
    const pageNumbers: number[] = [];
    const maxPagesToShow = 5;

    if (this.totalPages <= maxPagesToShow) {
      // If we have fewer pages than the max to show, display all pages
      for (let i = 1; i <= this.totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always include first page
      pageNumbers.push(1);

      // Calculate start and end of page numbers to show
      let start = Math.max(2, this.currentPage - 1);
      let end = Math.min(this.totalPages - 1, this.currentPage + 1);

      // Adjust if we're at the beginning
      if (this.currentPage <= 2) {
        end = Math.min(this.totalPages - 1, 4);
      }

      // Adjust if we're at the end
      if (this.currentPage >= this.totalPages - 1) {
        start = Math.max(2, this.totalPages - 3);
      }

      // Add ellipsis after first page if needed
      if (start > 2) {
        pageNumbers.push(-1); // -1 represents ellipsis
      }

      // Add middle pages
      for (let i = start; i <= end; i++) {
        pageNumbers.push(i);
      }

      // Add ellipsis before last page if needed
      if (end < this.totalPages - 1) {
        pageNumbers.push(-2); // -2 represents ellipsis
      }

      // Always include last page
      pageNumbers.push(this.totalPages);
    }

    return pageNumbers;
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.pageChange.emit(page);
    }
  }

  goToPreviousPage(): void {
    if (this.currentPage > 1) {
      this.goToPage(this.currentPage - 1);
    }
  }

  goToNextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.goToPage(this.currentPage + 1);
    }
  }
}
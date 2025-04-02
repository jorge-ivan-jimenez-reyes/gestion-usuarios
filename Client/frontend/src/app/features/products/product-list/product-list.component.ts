import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Product } from '../models/product.model';
import { ProductService } from '../../../services/product.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  isLoading: boolean = false;
  totalRecords: number = 0;
  currentPage: number = 1;
  totalPages: number = 1;
  searchTerm: string = '';
  filterOptions = {
    category: '',
    priceRange: ''
  };

  readonly ITEMS_PER_PAGE = 10;

  categories: { label: string; value: string }[] = [
    { label: 'All Categories', value: '' },
    { label: 'Electronics', value: 'electronics' },
    { label: 'Clothing', value: 'clothing' },
    { label: 'Books', value: 'books' }
  ];

  priceRanges: { label: string; value: string }[] = [
    { label: 'All Prices', value: '' },
    { label: 'Under $25', value: '0-25' },
    { label: '$25 - $50', value: '25-50' },
    { label: '$50 - $100', value: '50-100' },
    { label: 'Over $100', value: '100-' }
  ];

  constructor(
    private productService: ProductService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading = true;
    const params = {
      page: this.currentPage,
      searchTerm: this.searchTerm,
      ...this.filterOptions
    };
    this.productService.getProducts(params).subscribe({
      next: (response: any) => {
        this.products = response.items;
        this.totalRecords = response.totalRecords;
        this.totalPages = Math.ceil(this.totalRecords / this.ITEMS_PER_PAGE);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching products', error);
        this.isLoading = false;
      }
    });
  }

  onSearch(): void {
    this.resetPagination();
    this.loadProducts();
  }

  onFilter(): void {
    this.resetPagination();
    this.loadProducts();
  }

  deleteProduct(product: Product): void {
    if (confirm(`Are you sure you want to delete ${product.name}?`)) {
      this.productService.deleteProduct(product.id).subscribe({
        next: () => {
          this.loadProducts();
        },
        error: (error) => {
          console.error('Error deleting product', error);
        }
      });
    }
  }

  loadPreviousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadProducts();
    }
  }

  loadNextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadProducts();
    }
  }

  private resetPagination(): void {
    this.currentPage = 1;
  }

  bulkInsertProducts(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.productService.bulkInsertProducts(file).subscribe({
        next: (response) => {
          console.log('Bulk insert successful', response);
          this.loadProducts();
        },
        error: (error) => {
          console.error('Error during bulk insert', error);
        }
      });
    }
  }
}

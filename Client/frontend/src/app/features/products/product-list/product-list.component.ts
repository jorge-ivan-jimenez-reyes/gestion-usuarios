import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Product } from '../models/product.model';
import { ProductService } from '../../../services/product.service';
import { AuthService } from '../../../services/auth.service';
import { ToastService } from '../../../services/toast.service';

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
    private router: Router,
    private toastService: ToastService
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
    console.log('Fetching products with params:', params);
    this.productService.getProducts(params).subscribe({
      next: (response: any) => {
        console.log('Products received:', response);
        if (Array.isArray(response)) {
          this.products = response;
          this.totalRecords = response.length;
          this.totalPages = 1; // Assuming all products are returned in a single page
          console.log(`Loaded ${this.products.length} products. Total records: ${this.totalRecords}, Total pages: ${this.totalPages}`);
        } else if (response && response.items) {
          // Keep the existing logic for paginated response
          this.products = response.items;
          this.totalRecords = response.totalRecords || 0;
          this.totalPages = Math.ceil(this.totalRecords / this.ITEMS_PER_PAGE);
          console.log(`Loaded ${this.products.length} products. Total records: ${this.totalRecords}, Total pages: ${this.totalPages}`);
        } else {
          console.error('Unexpected response format:', response);
          this.products = [];
          this.totalRecords = 0;
          this.totalPages = 1;
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching products', error);
        this.products = [];
        this.totalRecords = 0;
        this.totalPages = 1;
        this.isLoading = false;
        this.toastService.showToast('Error fetching products: ' + error.message, 'error');
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
        next: (response) => {
          this.loadProducts();
          this.toastService.showToast(response.message || 'Product deleted successfully', 'success');
        },
        error: (error: any) => {
          console.error('Error deleting product', error);
          let errorMessage = 'An error occurred while deleting the product.';
          if (error instanceof Error) {
            errorMessage = error.message;
          } else if (error.error) {
            if (typeof error.error === 'string') {
              errorMessage = error.error;
            } else if (error.error.error) {
              errorMessage = error.error.error;
            } else if (error.error.errors && error.error.errors.length > 0) {
              errorMessage = error.error.errors[0].msg;
            }
          }
          this.toastService.showToast(`Error deleting product: ${errorMessage}`, 'error');
        }
      });
    }
  }

  updateProduct(product: Product): void {
    this.productService.updateProduct(product.id, product).subscribe({
      next: (updatedProduct) => {
        const index = this.products.findIndex(p => p.id === updatedProduct.id);
        if (index !== -1) {
          this.products[index] = updatedProduct;
        }
        this.toastService.showToast('Product updated successfully', 'success');
      },
      error: (error) => {
        console.error('Error updating product', error);
        this.toastService.showToast('Error updating product: ' + error.message, 'error');
      }
    });
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
          this.toastService.showToast('Bulk insert successful', 'success');
        },
        error: (error) => {
          console.error('Error during bulk insert', error);
          this.toastService.showToast('Error during bulk insert: ' + error.message, 'error');
        }
      });
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Product } from '../models/product.model';
import { ProductListService } from '../services/product-list.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, CurrencyPipe],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  searchTerm: string = '';
  filterOptions: { category: string } = { category: '' };
  isLoading: boolean = false;
  error: string | null = null;

  constructor(
    private productListService: ProductListService,
    private confirmationDialogService: ConfirmationDialogService
  ) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.isLoading = true;
    this.error = null;
    const params = {
      search: this.searchTerm,
      ...this.filterOptions
    };
    this.productListService.getProducts(params).subscribe({
      next: (response) => {
        this.products = response;
        this.isLoading = false;
      },
      error: (error) => {
        this.error = 'Error fetching products. Please try again.';
        this.isLoading = false;
        console.error('Error fetching products', error);
      }
    });
  }

  onSearch() {
    this.loadProducts();
  }

  onFilter() {
    this.loadProducts();
  }

  deleteProduct(productId: string) {
    this.confirmationDialogService.confirm('Are you sure you want to delete this product?')
      .subscribe((confirmed) => {
        if (confirmed) {
          this.productListService.deleteProduct(productId).subscribe({
            next: () => {
              this.loadProducts();
            },
            error: (error) => {
              this.error = 'Error deleting product. Please try again.';
              console.error('Error deleting product', error);
            }
          });
        }
      });
  }
}

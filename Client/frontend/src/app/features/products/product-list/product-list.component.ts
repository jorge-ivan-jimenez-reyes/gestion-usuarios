import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../services/product.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  products: any[] = [];
  searchTerm: string = '';
  filterOptions: any = {};

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    const params = {
      search: this.searchTerm,
      ...this.filterOptions
    };
    this.productService.getProducts(params).subscribe({
      next: (response) => {
        this.products = response;
      },
      error: (error) => {
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
}

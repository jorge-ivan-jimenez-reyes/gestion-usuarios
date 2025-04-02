import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Product } from '../models/product.model';
import { ProductListService, ProductListResponse } from '../services/product-list.service';
import { AuthService } from '../../../services/auth.service';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Table, TableLazyLoadEvent } from 'primeng/table';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    CurrencyPipe,
    TableModule,
    ButtonModule,
    InputTextModule,
    TooltipModule,
    ConfirmDialogModule,
    ToastModule,
    CardModule,
    DropdownModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent implements OnInit {
  @ViewChild('dt') dt: any;

  products: Product[] = [];
  isLoading: boolean = false;
  totalRecords: number = 0;
  rows: number = 10;
  first: number = 0;

  filterOptions = {
    name: '',
    category: null,
    priceRange: null
  };

  categories: any[] = [
    { label: 'All Categories', value: null },
    { label: 'Electronics', value: 'electronics' },
    { label: 'Clothing', value: 'clothing' },
    { label: 'Books', value: 'books' }
  ];

  priceRanges: any[] = [
    { label: 'All Prices', value: null },
    { label: 'Under $25', value: { min: 0, max: 25 } },
    { label: '$25 - $50', value: { min: 25, max: 50 } },
    { label: '$50 - $100', value: { min: 50, max: 100 } },
    { label: 'Over $100', value: { min: 100, max: null } }
  ];

  constructor(
    private productListService: ProductListService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts(event?: TableLazyLoadEvent) {
    this.isLoading = true;
    const params = this.getParams(event);

    this.productListService.getProducts(params).subscribe({
      next: (response: ProductListResponse) => {
        this.products = response.items;
        this.totalRecords = response.totalRecords;
        this.isLoading = false;
      },
      error: (error) => {
        this.messageService.add({severity:'error', summary: 'Error', detail: 'Error fetching products. Please try again.'});
        this.isLoading = false;
        console.error('Error fetching products', error);
      }
    });
  }

  getParams(event?: TableLazyLoadEvent) {
    const first = event?.first ?? 0;
    const rows = event?.rows ?? this.rows;
    let params: any = {
      ...this.filterOptions,
      page: Math.floor(first / rows) + 1,
      pageSize: rows
    };

    if (event?.sortField) {
      params.sortField = event.sortField;
      params.sortOrder = event.sortOrder === 1 ? 'asc' : 'desc';
    }

    return params;
  }

  onGlobalFilter(table: any, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  deleteProduct(product: Product) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this product?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.productListService.deleteProduct(product.id).subscribe({
          next: () => {
            this.loadProducts();
            this.messageService.add({severity:'success', summary: 'Successful', detail: 'Product Deleted', life: 3000});
          },
          error: (error) => {
            this.messageService.add({severity:'error', summary: 'Error', detail: 'Error deleting product. Please try again.'});
            console.error('Error deleting product', error);
          }
        });
      }
    });
  }

  onFilter() {
    this.first = 0;
    this.loadProducts();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ProductService } from '../../../services/product.service';
import { Product } from '../models/product.model';

export interface ProductListResponse {
  items: Product[];
  totalRecords: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductListService {
  constructor(private productService: ProductService) {}

  getProducts(page: number, searchTerm: string, filterOptions: any): Observable<ProductListResponse> {
    const params = {
      page,
      searchTerm,
      ...filterOptions
    };
    return this.productService.getProducts(params).pipe(
      map(response => ({
        items: response,
        totalRecords: response.length // Assuming the backend doesn't provide a total count
      }))
    );
  }

  deleteProduct(productId: string): Observable<void> {
    return this.productService.deleteProduct(productId);
  }
}

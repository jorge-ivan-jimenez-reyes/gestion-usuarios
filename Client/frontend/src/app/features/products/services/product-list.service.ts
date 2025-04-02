import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductService } from '../../../services/product.service';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductListService {
  constructor(private productService: ProductService) {}

  getProducts(params: any): Observable<Product[]> {
    return this.productService.getProducts(params);
  }

  deleteProduct(productId: string): Observable<void> {
    return this.productService.deleteProduct(productId);
  }
}

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiBaseService } from './api-base.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService extends ApiBaseService {
  private endpoint = '/products';

  createProduct(product: any): Observable<any> {
    return this.post(this.endpoint, product);
  }

  getProducts(params?: any): Observable<any> {
    return this.get(this.endpoint, params);
  }

  getProductById(id: string): Observable<any> {
    return this.get(`${this.endpoint}/${id}`);
  }

  updateProduct(id: string, product: any): Observable<any> {
    return this.put(`${this.endpoint}/${id}`, product);
  }

  deleteProduct(id: string): Observable<any> {
    return this.delete(`${this.endpoint}/${id}`);
  }

  bulkInsertProducts(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.post(`${this.endpoint}/bulk-insert`, formData);
  }
}

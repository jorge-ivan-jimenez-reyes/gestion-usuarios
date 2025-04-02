import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { ApiBaseService } from './api-base.service';
import { HttpHeaders, HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductService extends ApiBaseService {
  private endpoint = '/products';

  createProduct(product: any): Observable<any> {
    return this.post(this.endpoint, product).pipe(
      catchError(this.handleError('create product'))
    );
  }

  getProducts(params?: any): Observable<any> {
    return this.get(this.endpoint, params).pipe(
      catchError(this.handleError('get products'))
    );
  }

  getProductById(id: string): Observable<any> {
    return this.get(`${this.endpoint}/${id}`).pipe(
      catchError(this.handleError('get product'))
    );
  }

  updateProduct(id: string, product: any): Observable<any> {
    const body = {
      name: product.name,
      price: product.price,
      description: product.description
    };
    return this.put(`${this.endpoint}/${id}`, body).pipe(
      catchError(this.handleError('update product'))
    );
  }

  deleteProduct(id: string): Observable<any> {
    return this.delete(`${this.endpoint}/${id}`).pipe(
      catchError(this.handleError('delete product'))
    );
  }

  bulkInsertProducts(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.post(`${this.endpoint}/bulk-insert`, formData).pipe(
      catchError(this.handleError('bulk insert products'))
    );
  }

  private handleError(operation = 'operation') {
    return (error: HttpErrorResponse) => {
      console.error(`Error in ${operation}:`, error);
      let errorMessage = `An error occurred during ${operation}`;
      if (error.error instanceof ErrorEvent) {
        // Client-side or network error
        errorMessage = `Error: ${error.error.message}`;
      } else {
        // Backend error
        errorMessage = `Backend returned code ${error.status}, body was: ${JSON.stringify(error.error)}`;
      }
      return throwError(() => new Error(errorMessage));
    };
  }

  private isValidObjectId(id: string): boolean {
    // MongoDB ObjectId is a 24-character hex string
    const objectIdPattern = /^[0-9a-fA-F]{24}$/;
    return objectIdPattern.test(id);
  }
}

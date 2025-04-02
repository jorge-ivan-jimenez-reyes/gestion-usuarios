import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../services/product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-product',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.scss']
})
export class CreateProductComponent {
  product: any = {};

  constructor(private productService: ProductService, private router: Router) {}

  onSubmit() {
    this.productService.createProduct(this.product).subscribe({
      next: (response) => {
        console.log('Product created successfully', response);
        this.router.navigate(['/products']);
      },
      error: (error) => {
        console.error('Error creating product', error);
      }
    });
  }
}

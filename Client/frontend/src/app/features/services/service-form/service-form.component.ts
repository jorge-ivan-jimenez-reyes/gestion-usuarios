import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Service } from '../models/service.model';
import { ServicesService } from '../services/services.service';

@Component({
  selector: 'app-service-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './service-form.component.html',
  styleUrls: ['./service-form.component.scss']
})
export class ServiceFormComponent implements OnInit {
  serviceForm: FormGroup;
  isEditMode = false;
  isLoading = false;
  errorMessage = '';
  categories: any[] = [
    { label: 'Cleaning', value: 'cleaning' },
    { label: 'Maintenance', value: 'maintenance' },
    { label: 'Repair', value: 'repair' },
    { label: 'Installation', value: 'installation' },
    { label: 'Consultation', value: 'consultation' }
  ];

  constructor(
    private fb: FormBuilder,
    private servicesService: ServicesService,
    private route: ActivatedRoute,
    public router: Router
  ) {
    this.serviceForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      price: [null, [Validators.required, Validators.min(0)]],
      duration: [null, [Validators.required, Validators.min(1)]],
      category: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.loadService(id);
    }
  }

  loadService(id: string): void {
    this.isLoading = true;
    this.servicesService.getService(id).subscribe({
      next: (service) => {
        this.serviceForm.patchValue(service);
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load service';
        this.isLoading = false;
        this.router.navigate(['/services']);
      }
    });
  }

  onSubmit(): void {
    if (this.serviceForm.valid) {
      this.isLoading = true;
      const service: Service = this.serviceForm.value;
      const operation = this.isEditMode
        ? this.servicesService.updateService(this.route.snapshot.paramMap.get('id')!, service)
        : this.servicesService.createService(service);

      operation.subscribe({
        next: () => {
          const message = this.isEditMode ? 'Service updated successfully' : 'Service created successfully';
          this.router.navigate(['/services']);
        },
        error: (error) => {
          const action = this.isEditMode ? 'update' : 'create';
          this.errorMessage = `Failed to ${action} service`;
          this.isLoading = false;
        }
      });
    } else {
      Object.keys(this.serviceForm.controls).forEach(key => {
        const control = this.serviceForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
      this.errorMessage = 'Please fill all required fields correctly';
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextarea } from 'primeng/inputtextarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Service } from '../models/service.model';
import { ServicesService } from '../services/services.service';

@Component({
  selector: 'app-service-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    InputTextarea,
    InputNumberModule,
    DropdownModule,
    ButtonModule,
    ToastModule,
    RouterModule
  ],
  providers: [MessageService],
  templateUrl: './service-form.component.html',
  styleUrls: ['./service-form.component.scss']
})
export class ServiceFormComponent implements OnInit {
  serviceForm: FormGroup;
  isEditMode = false;
  categories: any[] = [
    { label: 'Cleaning', value: 'cleaning' },
    { label: 'Maintenance', value: 'maintenance' },
    { label: 'Repair', value: 'repair' },
    { label: 'Installation', value: 'installation' }
  ];

  constructor(
    private fb: FormBuilder,
    private servicesService: ServicesService,
    private route: ActivatedRoute,
    public router: Router,
    private messageService: MessageService
  ) {
    this.serviceForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      duration: [0, [Validators.required, Validators.min(0)]],
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
    this.servicesService.getService(id).subscribe({
      next: (service) => this.serviceForm.patchValue(service),
      error: (error) => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load service' })
    });
  }

  onSubmit(): void {
    if (this.serviceForm.valid) {
      const service: Service = this.serviceForm.value;
      if (this.isEditMode) {
        const id = this.route.snapshot.paramMap.get('id')!;
        this.servicesService.updateService(id, service).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Service updated successfully' });
            this.router.navigate(['/services']);
          },
          error: (error) => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update service' })
        });
      } else {
        this.servicesService.createService(service).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Service created successfully' });
            this.router.navigate(['/services']);
          },
          error: (error) => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to create service' })
        });
      }
    }
  }
}

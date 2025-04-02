import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Service } from '../models/service.model';
import { ServicesService } from '../services/services.service';

@Component({
  selector: 'app-service-list',
  standalone: true,
  imports: [CommonModule, RouterModule, TableModule, ButtonModule, ConfirmDialogModule, ToastModule, InputTextModule],
  providers: [ConfirmationService, MessageService],
  templateUrl: './service-list.component.html',
  styleUrls: ['./service-list.component.scss']
})
export class ServiceListComponent implements OnInit {
  @ViewChild('dt') dt: any;
  services: Service[] = [];

  constructor(
    private servicesService: ServicesService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.loadServices();
  }

  loadServices(): void {
    this.servicesService.getServices().subscribe({
      next: (services) => this.services = services,
      error: (error) => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load services' })
    });
  }

  deleteService(service: Service): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete the service "${service.name}"?`,
      accept: () => {
        this.servicesService.deleteService(service.id).subscribe({
          next: () => {
            this.loadServices();
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Service deleted successfully' });
          },
          error: (error) => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete service' })
        });
      }
    });
  }

  applyFilterGlobal(event: Event, stringVal: string) {
    const searchValue = (event.target as HTMLInputElement).value;
    this.dt.filterGlobal(searchValue, stringVal);
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Service } from '../models/service.model';
import { ServicesService } from '../services/services.service';

@Component({
  selector: 'app-service-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './service-list.component.html',
  styleUrls: ['./service-list.component.scss']
})
export class ServiceListComponent implements OnInit {
  services: Service[] = [];
  isLoading: boolean = false;
  error: string | null = null;
  totalRecords: number = 0;
  currentPage: number = 1;
  totalPages: number = 1;
  searchTerm: string = '';
  filterOptions = {
    category: ''
  };

  readonly ITEMS_PER_PAGE = 10;

  categories: string[] = ['All', 'Category1', 'Category2', 'Category3']; // Replace with actual categories

  constructor(private servicesService: ServicesService) { }

  ngOnInit(): void {
    this.loadServices();
  }

  loadServices(): void {
    this.isLoading = true;
    this.error = null;
    this.servicesService.getServices(this.currentPage, this.searchTerm, this.filterOptions.category).subscribe({
      next: (response: Service[]) => {
        console.log('Received service data:', response);
        this.services = response || [];
        this.totalRecords = this.services.length;
        this.totalPages = Math.ceil(this.totalRecords / this.ITEMS_PER_PAGE);
        this.isLoading = false;
        console.log('Processed service data:', {
          services: this.services,
          totalRecords: this.totalRecords,
          totalPages: this.totalPages
        });
      },
      error: (error) => {
        console.error('Error fetching services', error);
        this.error = 'Failed to load services. Please try again later.';
        this.isLoading = false;
        this.services = [];
        this.totalRecords = 0;
        this.totalPages = 1;
      }
    });
  }

  onSearch(): void {
    this.resetPagination();
    this.loadServices();
  }

  onFilter(): void {
    this.resetPagination();
    this.loadServices();
  }

  deleteService(service: Service): void {
    if (confirm(`Are you sure you want to delete ${service.name}?`)) {
      this.servicesService.deleteService(service.id).subscribe({
        next: () => {
          this.loadServices();
        },
        error: (error) => {
          console.error('Error deleting service', error);
          this.error = 'Failed to delete service. Please try again later.';
        }
      });
    }
  }

  loadPreviousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadServices();
    }
  }

  loadNextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadServices();
    }
  }

  private resetPagination(): void {
    this.currentPage = 1;
  }
}

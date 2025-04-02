import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, CardModule, ButtonModule],
  template: `
    <div class="dashboard-container">
      <h1>Welcome to the Dashboard</h1>
      <div class="card-container">
        <p-card header="Products" [style]="{'width': '300px', 'margin-bottom': '2em'}">
          <p>Manage your product inventory</p>
          <ng-template pTemplate="footer">
            <p-button label="Go to Products" icon="pi pi-box" [routerLink]="['/products']"></p-button>
          </ng-template>
        </p-card>
        <p-card header="Services" [style]="{'width': '300px', 'margin-bottom': '2em'}">
          <p>Manage your service offerings</p>
          <ng-template pTemplate="footer">
            <p-button label="Go to Services" icon="pi pi-cog" [routerLink]="['/services']"></p-button>
          </ng-template>
        </p-card>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 2rem;
      max-width: 800px;
      margin: 0 auto;
    }
    .card-container {
      display: flex;
      justify-content: space-around;
      flex-wrap: wrap;
    }
    h1 {
      text-align: center;
      margin-bottom: 2rem;
    }
  `]
})
export class DashboardComponent {}

import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { AuthGuard } from './guards/auth.guard';
import { DashboardComponent } from './features/dashboard/dashboard.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'products', 
    loadComponent: () => import('./features/products/product-list/product-list.component').then(m => m.ProductListComponent),
    canActivate: [AuthGuard] 
  },
  {
    path: 'services',
    loadComponent: () => import('./features/services/service-list/service-list.component').then(m => m.ServiceListComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'products/create',
    loadComponent: () => import('./features/products/create-product/create-product.component').then(m => m.CreateProductComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'products/:id/edit',
    loadComponent: () => import('./features/products/create-product/create-product.component').then(m => m.CreateProductComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'services/create',
    loadComponent: () => import('./features/services/service-form/service-form.component').then(m => m.ServiceFormComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'services/:id/edit',
    loadComponent: () => import('./features/services/service-form/service-form.component').then(m => m.ServiceFormComponent),
    canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: '/login' }
];

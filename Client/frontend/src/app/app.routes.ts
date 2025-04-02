import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { ProductListComponent } from './features/products/product-list/product-list.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/products', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'products', component: ProductListComponent, canActivate: [AuthGuard] },
  {
    path: 'services',
    loadComponent: () => import('./features/services/service-list/service-list.component').then(m => m.ServiceListComponent),
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
  { path: '**', redirectTo: '/products' }
];

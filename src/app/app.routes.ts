import { Routes } from '@angular/router';
import { UserManagementComponent } from './pages/user-management.component';
import { LoginComponent } from './pages/login.component';

export const routes: Routes = [
  {
    path: '/app',
    redirectTo: '/app/login',
    pathMatch: 'full'
  },
  {
    path: '/app/login',
    component: LoginComponent
  },
  {
    path: '/app/users',
    component: UserManagementComponent
  }
]; 
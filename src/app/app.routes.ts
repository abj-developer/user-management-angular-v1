import { Routes } from '@angular/router';
import { UserManagementComponent } from './pages/user-management.component';
import { LoginComponent } from './pages/login.component';
import { AuthGuard } from './services/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'users',
    component: UserManagementComponent,
    canActivate: [AuthGuard]
  }
];
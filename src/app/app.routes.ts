import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { LayoutComponent } from './layout/layout.component';

export const routes: Routes = [
  {
    path: '',
    component: LoginComponent
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'painel',
        loadComponent: () =>
          import('./pages/painel/painel.component').then(m => m.PainelComponent)
      },
      {
        path: 'roles',
        loadComponent: () =>
          import('./pages/roles/roles.component').then(r => r.RolesComponent)
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];

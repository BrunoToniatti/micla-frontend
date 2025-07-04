import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { LayoutComponent } from './layout/layout.component';
import { UsersComponent } from './pages/users/users.component';
import { UserFormComponent } from './pages/user-form/user-form.component';
import { ProjectsComponent } from './pages/projects/projects.component';

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
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./pages/users/users.component').then(u => UsersComponent)
      },
      {
        path: 'projects',
        loadComponent: () =>
          import('./pages/projects/projects.component').then(p => ProjectsComponent)
      },
      {
        path: 'projects/new',
        loadComponent: () =>
          import('./pages/projects/project-form/project-form.component').then(m => m.ProjectFormComponent)
      },
      {
        path: 'projects/:id/edit',
        loadComponent: () =>
          import('./pages/projects/project-form/project-form.component').then(m => m.ProjectFormComponent)
      },
      {
        path: 'projects/:id',
        loadComponent: () =>
          import('./pages/projects/project-detail/project-detail.component').then(m => m.ProjectDetailComponent)
      }
    ]
  },
  {
    path: 'ativar-conta',
    component: UserFormComponent

  },
  {
    path: '**',
    redirectTo: ''
  }
];

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {
users = [
    { name: 'João Silva', email: 'joao@email.com', role: 'Administrador' },
    { name: 'Ana Costa', email: 'ana@email.com', role: 'Colaborador' },
    { name: 'Carlos Lima', email: 'carlos@email.com', role: 'Supervisor' }
  ];
}

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Invite, UsersService } from '../../services/users.service';
import { FormsModule } from '@angular/forms';
import { RoleService } from '../../services/role.service';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatTooltipModule,
    MatCardModule,
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateX(-100%)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ])
    ]),
    trigger('messageAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-20px) scale(0.8)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0) scale(1)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0, transform: 'translateY(-20px) scale(0.8)' }))
      ])
    ])
  ]
})
export class UsersComponent implements OnInit {

  roles: any = [];

  showForm = false;
  users: any = [];
  invites: any = [];
  message: string = '';
  isLoading = false;
  isLoadingUsers = false;
  isLoadingInvites = false;

  newUser = {
    email: '',
    role: 0,
  }

  constructor(
    private userService: UsersService,
    private roleService: RoleService
  ) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.listUsers();
    this.listRoles();
    this.listInvites();

    // Simula tempo de carregamento inicial
    setTimeout(() => {
      this.isLoading = false;
    }, 800);
  }

  toggleForm() {
    this.showForm = !this.showForm
  }

  addUser() {
    const payload: Invite = {
      email: this.newUser.email,
      role: this.newUser.role
    }
    this.userService.createInvite(payload).subscribe({
      next: (res) => {
        this.showForm = false;
        this.showMessage('Convite enviado com sucesso');
        this.listInvites();
        // Limpar formulário
        this.newUser = { email: '', role: 0 };
      }
    })
  }

  listUsers() {
    this.isLoadingUsers = true;
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.isLoadingUsers = false;
      },
      error: () => {
        this.isLoadingUsers = false;
      }
    })
  }

  listRoles() {
    this.roleService.getRoles().subscribe({
      next: (roles) => {
        this.roles = roles
      }
    })
  }

  listInvites() {
    this.isLoadingInvites = true;
    this.userService.getInvites().subscribe({
      next: (invites) => {
        this.invites = invites;
        this.isLoadingInvites = false;
      },
      error: () => {
        this.isLoadingInvites = false;
      }
    })
  }

  onDeleteUser(id: number){
    this.userService.deleteUser(id).subscribe({
      next: (res) => {
        this.showMessage('Usuário excluído com sucesso');
        this.listUsers();
      },
      error: (err) => {
        this.showMessage('Erro ao excluir usuário: ' + err.message);
      }
    })
  }

  deleteInvite(id: number) {
    this.userService.deleteInvite(id).subscribe({
      next: (res) => {
        this.showMessage('Convite excluído com sucesso');
        this.listInvites();
      }
    })
  }

  // Novos métodos para ações dos usuários
  onViewUser(user: any) {
    console.log('Visualizar usuário:', user);
    // Implementar lógica para visualizar usuário
  }

  onEditUser(user: any) {
    console.log('Editar usuário:', user);
    // Implementar lógica para editar usuário
  }

  // Novos métodos para ações dos convites
  onViewInvite(invite: any) {
    console.log('Visualizar convite:', invite);
    // Implementar lógica para visualizar convite
  }

  onEditInvite(invite: any) {
    console.log('Editar convite:', invite);
    // Implementar lógica para editar convite
  }

  private showMessage(msg: string) {
    this.message = msg;
    setTimeout(() => {
      this.message = '';
    }, 4000);
  }
}

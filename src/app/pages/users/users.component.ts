import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Invite, UsersService } from '../../services/users.service';
import { FormsModule } from '@angular/forms';
import { RoleService } from '../../services/role.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {

  roles: any = [];

  showForm = false;
  users: any = [];
  invites: any = [];
  message: string = '';

  newUser = {
    email: '',
    role: 0,
  }

  constructor(
    private userService: UsersService,
    private roleService: RoleService
  ) { }

  ngOnInit(): void {
    this.listUsers()
    this.listRoles()
    this.listInvites()
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
        this.message = 'Convite enviado com sucesso';
        this.listInvites();
        setTimeout(() => {
          this.message = '';
        }, 4000)
      }
    })
  }

  listUsers() {
    this.userService.getUsers().subscribe({
      next: (users) => {
        // Se conseguir listar os usuários
        this.users = users
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
    this.userService.getInvites().subscribe({
      next: (invites) => {
        this.invites = invites
        console.log(invites)
      }
    })
  }

  deleteInvite(id: number) {
    this.userService.deleteInvite(id).subscribe({
      next: (res) => {
        this.message = 'Convite excluido com sucesso';
        setTimeout(() => {
          this.message = '';
        }, 4000);
        this.listInvites();
      }
    })
  }
}

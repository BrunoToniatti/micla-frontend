import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Invite, UsersService } from '../../services/users.service';
import { FormsModule } from '@angular/forms';
import { RoleService } from '../../services/role.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {

  roles: any = [];

  showForm = false;
  users: any = []

  newUser = {
    email: '',
    role: 0,
  }

  constructor(
    private userService: UsersService,
    private roleService: RoleService
  ){}

  ngOnInit(): void{
    this.listUsers()
    this.listRoles()
  }

  toggleForm(){
    this.showForm = !this.showForm
  }

  addUser(){
    const payload: Invite = {
      email: this.newUser.email,
      role: this.newUser.role
    }

    this.userService.createInvite(payload).subscribe({
      next: (res) => {
        console.log('Foi')
      }
    })
  }

  listUsers(){
    this.userService.getUsers().subscribe({
      next: (users) => {
        // Se conseguir listar os usuários
        this.users = users
      }
    })
  }

  listRoles(){
    this.roleService.getRoles().subscribe({
      next: (roles) => {
        this.roles = roles
      }
    })
  }
}

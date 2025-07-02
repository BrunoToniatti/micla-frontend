import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { FormsModule } from '@angular/forms';

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

  cargos = ['Administrador', 'Colaborador', 'Supervisor'];

  showForm = false;
  users: any = []

  newUser = {
    email: '',
    role: '',
  }

  constructor(
    private userService: UsersService
  ){}

  ngOnInit(): void{
    this.listUsers()
  }

  toggleForm(){
    this.showForm = !this.showForm
  }

  addUser(){

  }

  listUsers(){
    this.userService.getUsers().subscribe({
      next: (users) => {
        // Se conseguir listar os usuários
        this.users = users
        console.log(users)
      }
    })
  }
}

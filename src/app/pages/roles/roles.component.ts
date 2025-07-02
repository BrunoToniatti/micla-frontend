import { Component } from '@angular/core';
import { Role, RoleService } from '../../services/role.service';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [
    MatListModule,
    CommonModule,
    MatIconModule,
    FormsModule,
    MatFormFieldModule
  ],
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.scss'
})
export class RolesComponent {

  roles: any = []
  message: string = '';
  showForm: boolean = false;

  newRole = {
    name: '',
    description: ''
  }

  constructor(private roleService: RoleService) { }

  ngOnInit(): void {
    this.listRoles()
  }

  deleteRole(id: number) {
    this.roleService.deleteRole(id).subscribe(() => {
      this.message = 'Cargo excluido com sucesso';
      setTimeout(() => {
        this.message = '';
      }, 3000);
      this.listRoles()
    });
  };

  save() {
    const payload: Role = {
      name: this.newRole.name,
      description: this.newRole.description
    }
    console.log('salvando')

    this.roleService.newRole(payload).subscribe({
      next: (res: any) => {
        this.message = 'Cargo adicionado com sucesso';
        setTimeout(() => {
          this.message = '';
        }, 3000);
        this.showForm = false;
        this.listRoles();
      },
      error: (err: any) => console.log('erro', err)
    });
  }


  listRoles() {
    this.roleService.getRoles().subscribe((role) => {
      this.roles = role
    })
  }
}

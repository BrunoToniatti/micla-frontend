import { Component, OnInit } from '@angular/core';
import { Role, RoleService } from '../../services/role.service';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [
    MatListModule,
    CommonModule,
    MatIconModule,
    FormsModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatTooltipModule,
    MatCardModule,
  ],
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.scss',
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
export class RolesComponent implements OnInit {

  roles: any = []
  message: string = '';
  showForm: boolean = false;
  editing: boolean = false;
  isLoading = false;
  isLoadingRoles = false;

  newRole = {
    id: 0,
    name: '',
    description: ''
  }

  constructor(private roleService: RoleService) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.listRoles();

    // Simula tempo de carregamento inicial
    setTimeout(() => {
      this.isLoading = false;
    }, 800);
  }

  deleteRole(id: number) {
    this.roleService.deleteRole(id).subscribe(() => {
      this.showMessage('Cargo excluído com sucesso');
      this.listRoles();
    });
  }

  toogleForm(){
    this.showForm = !this.showForm;
    this.resetForm();
    this.editing = false;
  }

  resetForm(){
    this.newRole = {
      id: 0,
      name: '',
      description: ''
    }
  }

  save(id: number = 0) {
    const payload: Role = {
      name: this.newRole.name,
      description: this.newRole.description
    }
    if(id == 0){
      // Se id não for passado, então esta salvando o meu cargo
      this.roleService.newRole(payload).subscribe({
        next: (res: any) => {
          this.showMessage('Cargo adicionado com sucesso');
          this.showForm = false;
          this.editing = false;
          this.listRoles();
          this.resetForm();
        },
        error: (err: any) => console.log('erro', err)
      });
    } else {
      this.roleService.updateRole(id, payload).subscribe({
        next: (res: any) => {
          this.showMessage('Cargo atualizado com sucesso');
          this.showForm = false;
          this.editing = false;
          this.listRoles();
          this.resetForm();
        }
      })
    }
  }

  // Para editar eu preciso passar toda a estrutura de role, todo o array[]
  edit(role: any){
    this.newRole = {
      id: role.id,
      name: role.name,
      description: role.description
    }
    this.editing = true;
    this.showForm = true;
  }

  listRoles() {
    this.isLoadingRoles = true;
    this.roleService.getRoles().subscribe({
      next: (roles) => {
        this.roles = roles;
        this.isLoadingRoles = false;
      },
      error: () => {
        this.isLoadingRoles = false;
      }
    });
  }

  // Novos métodos para ações dos cargos
  onViewRole(role: any) {
    console.log('Visualizar cargo:', role);
    // Implementar lógica para visualizar cargo
  }

  onEditRole(role: any) {
    this.edit(role);
  }

  onDeleteRole(role: any) {
    this.deleteRole(role.id);
  }

  private showMessage(msg: string) {
    this.message = msg;
    setTimeout(() => {
      this.message = '';
    }, 4000);
  }
}

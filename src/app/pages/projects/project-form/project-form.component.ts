import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { trigger, state, style, transition, animate } from '@angular/animations';

import { ProjectsService, Project, User } from '../../../services/projects.service';
import { UsersService } from '../../../services/users.service';
import { filter, map } from 'rxjs';

@Component({
  selector: 'app-project-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './project-form.component.html',
  styleUrl: './project-form.component.scss',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class ProjectFormComponent implements OnInit {
  projectForm: FormGroup;
  isEditMode = false;
  isSubmitting = false;
  projectId: number | null = null;
  availableUsers: User[] = [];

  constructor(
    private fb: FormBuilder,
    private projectsService: ProjectsService,
    private usersService: UsersService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.projectForm = this.createForm();
  }

  ngOnInit(): void {
    this.loadAvailableUsers();
    this.checkEditMode();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      client: ['', [Validators.required]],
      status: ['planning', [Validators.required]],
      priority: ['medium', [Validators.required]],
      start_date: ['', [Validators.required]],
      expected_end_date: ['', [Validators.required]],
      manager_id: ['']
    }, {
      validators: this.dateOrderValidator
    });
  }

  private dateOrderValidator(control: AbstractControl): { [key: string]: any } | null {
    const startDate = control.get('start_date')?.value;
    const endDate = control.get('expected_end_date')?.value;

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (start >= end) {
        return { dateOrder: true };
      }
    }

    return null;
  }

  private checkEditMode(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.projectId = +params['id'];
        this.loadProject();
      }
    });
  }

  private loadProject(): void {
    if (this.projectId) {
      this.projectsService.getProjectById(this.projectId).subscribe({
        next: (project) => {
          this.populateForm(project);
          this.projectForm.patchValue({
            manager_id: project.manager?.id || ''
          });
        },
        error: (error) => {
          console.error('Erro ao carregar projeto:', error);
          this.showSnackBar('Erro ao carregar projeto!', 'error');
          this.router.navigate(['/projects']);
        }
      });
    }
  }

  private populateForm(project: Project): void {
    this.projectForm.patchValue({
      name: project.name,
      description: project.description,
      client: project.client,
      status: project.status,
      priority: project.priority,
      start_date: project.start_date ? new Date(project.start_date) : '',
      expected_end_date: project.expected_end_date ? new Date(project.expected_end_date) : '',
      manager_id: project.manager_id || ''
    });
  }

  private loadAvailableUsers(): void {
    /* Esse método pega apenas os usuários que são gerentes dentro do projeto **/
    this.usersService.getUsers().pipe(
      map(users =>
        users.filter(user => user.profile?.role?.name == 'Gerente')
      )
    ).subscribe({
      next: (filteredUsers: any) => {
        this.availableUsers = filteredUsers;
      },
      error: (error) => {
        console.error('Erro ao carregar usuários:', error);
      }
    });
  }

  createProject(data: Partial<Project>): void {
    this.projectsService.createProject(data).subscribe({
      next: (project) => {
        this.isSubmitting = false;
        this.showSnackBar('Projeto criado com sucesso!', 'success');
        this.router.navigate(['/projects', project.id]);
      },
      error: (error) => {
        this.isSubmitting = false;
        console.error('Erro ao criar projeto:', error);
        this.showSnackBar('Erro ao criar projeto!', 'error');
      }
    })
  }

  updateProject(data: Partial<Project>): void {
    if (this.projectId) {
      this.projectsService.updateProject(this.projectId, data).subscribe({
        next: (project) => {
          this.isSubmitting = false;
          this.showSnackBar('Projeto atualizado com sucesso!', 'success');
          this.router.navigate(['/projects', project.id]);
        },
        error: (error) => {
          this.isSubmitting = false;
          console.error('Erro ao atualizar projeto:', error);
          this.showSnackBar('Erro ao atualizar projeto!', 'error');
        }
      });
    }
  }

  onSubmit(): void {
    if (this.projectForm.valid) {
      this.isSubmitting = true;

      const formData = this.prepareFormData();

      if (this.isEditMode && this.projectId) {
        this.updateProject(formData);
      } else {
        this.createProject(formData);
      }
    } else {
      this.markFormGroupTouched();
      this.showSnackBar('Por favor, corrija os erros no formulário!', 'error');
    }
  }

  private prepareFormData(): Partial<Project> {
    const formValue = this.projectForm.value;

    return {
      name: formValue.name,
      description: formValue.description,
      client: formValue.client,
      status: formValue.status,
      priority: formValue.priority,
      start_date: this.formatDate(formValue.start_date),
      expected_end_date: this.formatDate(formValue.expected_end_date),
      manager_id: formValue.manager_id || null
    };
  }

  private formatDate(date: any): string {
    if (!date) return '';
    if (date instanceof Date) {
      return date.toISOString().split('T')[0];
    }
    return date;
  }

  // private createProject(projectData: Partial<Project>): void {
  //   this.projectsService.createProject(projectData).subscribe({
  //     next: (project) => {
  //       this.isSubmitting = false;
  //       this.showSnackBar('Projeto criado com sucesso!', 'success');
  //       this.router.navigate(['/projects', project.id]);
  //     },
  //     error: (error) => {
  //       this.isSubmitting = false;
  //       console.error('Erro ao criar projeto:', error);
  //       this.showSnackBar('Erro ao criar projeto!', 'error');
  //     }
  //   });
  // }

  // private updateProject(projectData: Partial<Project>): void {
  //   if (this.projectId) {
  //     this.projectsService.updateProject(this.projectId, projectData).subscribe({
  //       next: (project) => {
  //         this.isSubmitting = false;
  //         this.showSnackBar('Projeto atualizado com sucesso!', 'success');
  //         this.router.navigate(['/projects', project.id]);
  //       },
  //       error: (error) => {
  //         this.isSubmitting = false;
  //         console.error('Erro ao atualizar projeto:', error);
  //         this.showSnackBar('Erro ao atualizar projeto!', 'error');
  //       }
  //     });
  //   }
  // }

  private markFormGroupTouched(): void {
    Object.keys(this.projectForm.controls).forEach(key => {
      const control = this.projectForm.get(key);
      control?.markAsTouched();
    });
  }

  onCancel(): void {
    if (this.isEditMode && this.projectId) {
      this.router.navigate(['/projects', this.projectId]);
    } else {
      this.router.navigate(['/projects']);
    }
  }

  private showSnackBar(message: string, type: 'success' | 'error'): void {
    this.snackBar.open(message, 'Fechar', {
      duration: 5000,
      panelClass: type === 'success' ? 'snack-success' : 'snack-error',
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }
}

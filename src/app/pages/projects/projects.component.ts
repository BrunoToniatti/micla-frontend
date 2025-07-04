import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSortModule } from '@angular/material/sort';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableDataSource } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';

import { ProjectsService, Project } from '../../services/projects.service';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatChipsModule,
    MatButtonModule,
    MatSortModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatDialogModule,
    FormsModule,
  ],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateX(-100%)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ])
    ]),
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class ProjectsComponent implements OnInit, OnDestroy {
  searchTerm = '';
  displayedColumns = ['name', 'client', 'status', 'start_date', 'expected_end_date', 'actions'];
  isLoading = false;

  projects: Project[] = [];
  dataSource = new MatTableDataSource<Project>([]);

  private destroy$ = new Subject<void>();

  constructor(
    private projectsService: ProjectsService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.setupFilterPredicate();
  }

  ngOnInit(): void {
    this.loadProjects();
    this.getProjects();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupFilterPredicate(): void {
    this.dataSource.filterPredicate = (data: Project, filter: string) => {
      const val = filter.trim().toLowerCase();
      return (
        data.name.toLowerCase().includes(val) ||
        (data.client?.toLowerCase().includes(val) || false) ||
        (data.status_display).toLowerCase().includes(val) ||
        data.start_date.includes(val) ||
        (data.expected_end_date?.includes(val) || false)
      );
    };
  }

  getProjects(){
    this.projectsService.getProjects().subscribe({
      next: (projects: Project[]) => {
        this.projects = projects;
        this.dataSource.data = this.projects;
      }
    })
  }

  // Simular carregamento
  private loadProjects(): void {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
  }

  applyFilter(): void {
    this.dataSource.filter = this.searchTerm.trim().toLowerCase();
  }

  getChipColor(status: string): string {
    return this.projectsService.getStatusColor(status);
  }

  getPriorityDisplayName(priority: string): string {
    return this.projectsService.getPriorityDisplayName(priority);
  }

  onNewProject(): void {
    this.router.navigate(['/projects/new']);
  }

  onViewProject(project: Project): void {
    this.router.navigate(['/projects', project.id]);
  }

  onEditProject(project: Project): void {
    this.router.navigate(['/projects', project.id, 'edit']);
  }

  onDeleteProject(project: Project): void {
    if (confirm(`Tem certeza que deseja excluir o projeto "${project.name}"?`)) {
      // Simular exclusão hardcoded
      this.projects = this.projects.filter(p => p.id !== project.id);
      this.dataSource.data = this.projects;
      this.showSnackBar('Projeto excluído com sucesso!', 'success');
    }
  }

  formatDate(date: string): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('pt-BR');
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

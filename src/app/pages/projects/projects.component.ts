import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [
    CommonModule,
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
export class ProjectsComponent implements OnInit {
  searchTerm = '';
  displayedColumns = ['name', 'company', 'status', 'start', 'end', 'actions'];
  isLoading = false;

  projects = [
    {
      name: 'Site institucional ABC',
      company: 'XPTO Ltda',
      status: 'Ativo',
      start: '2025-07-01',
      end: '2025-08-15',
    },
    {
      name: 'Plataforma EAD XYZ',
      company: 'EduTech Brasil',
      status: 'Pausado',
      start: '2025-06-10',
      end: '2025-09-01',
    },
    {
      name: 'App de entregas FastGo',
      company: 'FastGo Ltda',
      status: 'Concluído',
      start: '2025-04-01',
      end: '2025-06-15',
    },
    {
      name: 'Sistema de Gestão Hospitalar',
      company: 'MedTech Solutions',
      status: 'Ativo',
      start: '2025-05-15',
      end: '2025-10-30',
    },
    {
      name: 'E-commerce Fashion Store',
      company: 'StyleTech Ltda',
      status: 'Concluído',
      start: '2025-03-01',
      end: '2025-06-01',
    },
  ];

  dataSource = new MatTableDataSource(this.projects);

  constructor() {
    this.dataSource.filterPredicate = (data: any, filter: any) => {
      const val = filter.trim().toLowerCase();
      return (
        data.name.toLowerCase().includes(val) ||
        data.company.toLowerCase().includes(val) ||
        data.status.toLowerCase().includes(val) ||
        data.start.includes(val) ||
        data.end.includes(val)
      );
    };
  }

  ngOnInit() {
    // Simula carregamento inicial
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
  }

  applyFilter() {
    this.dataSource.filter = this.searchTerm.trim().toLowerCase();
  }

  getChipColor(status: string): string {
    switch (status) {
      case 'Ativo':
        return 'green-chip';
      case 'Pausado':
        return 'warn-chip';
      case 'Concluído':
        return 'gray-chip';
      default:
        return '';
    }
  }

  onNewProject() {
    // Implementar lógica para criar novo projeto
    console.log('Novo projeto clicado');
  }

  onEditProject(project: any) {
    // Implementar lógica para editar projeto
    console.log('Editar projeto:', project);
  }

  onDeleteProject(project: any) {
    // Implementar lógica para deletar projeto
    console.log('Deletar projeto:', project);
  }

  onViewProject(project: any) {
    // Implementar lógica para visualizar projeto
    console.log('Visualizar projeto:', project);
  }
}

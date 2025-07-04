import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Subject, takeUntil, forkJoin } from 'rxjs';

import {
  ProjectsService,
  Project,
  Task,
  TimeEntry,
  ProjectAttachment,
  ProjectComment,
  ActivityLog,
  ProjectMember,
  ProjectTag,
  User
} from '../../../services/projects.service';

import { AddTeamMemberDialogComponent, AddTeamMemberData } from './dialogs/add-team-member-dialog.component';
import { AddTagDialogComponent, AddTagData } from './dialogs/add-tag-dialog.component';
import { AddTaskDialogComponent, AddTaskData } from './dialogs/add-task-dialog.component';
import { AddTimeEntryDialogComponent, AddTimeEntryData } from './dialogs/add-time-entry-dialog.component';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatTabsModule,
    MatChipsModule,
    MatProgressBarModule,
    MatBadgeModule,
    MatMenuModule,
    MatDialogModule,
    MatTableModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './project-detail.component.html',
  styleUrl: './project-detail.component.scss',
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
    ])
  ]
})
export class ProjectDetailComponent implements OnInit, OnDestroy {
  project: Project = {
    id: 0,
    name: '',
    description: '',
    start_date: '',
    status: '',
    progress: 0
  } as Project;
  tasks: Task[] = [];
  timeEntries: TimeEntry[] = [];
  attachments: ProjectAttachment[] = [];
  comments: ProjectComment[] = [];
  activityLog: ActivityLog[] = [];

  newComment = '';
  isLoading = false;

  private destroy$ = new Subject<void>();
  private projectId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectsService: ProjectsService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.projectId = +params['id'];
      if (this.projectId) {
        this.getProjectById(this.projectId);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getProjectById(id: number){
    this.projectsService.getProjectById(id).subscribe({
      next: (project: Project) => {
        this.project = project;
        this.tasks = project.tasks || [];
        this.timeEntries = project.time_entries || [];
        this.attachments = project.attachments || [];
        this.comments = project.comments || [];
        this.activityLog = project.activity_log || [];
      }
    })
  }

  // private loadProjectDetails(): void {
  //   if (!this.projectId) return;

  //   this.isLoading = true;

  //   // Simular carregamento com dados hardcoded
  //   setTimeout(() => {
  //     this.getProjectById();
  //   }, 1000);
  // }

  // private loadHardcodedData(): void {
  //   // Dados hardcoded mais completos para demonstração
  //   this.project = {
  //     id: this.projectId!,
  //     name: 'Sistema de Gestão MICLA',
  //     description: 'Desenvolvimento completo de sistema de gestão de projetos para a empresa MICLA Engineering & Design',
  //     status: 'in_progress',
  //     status_display: 'Em Andamento',
  //     priority: 'high',
  //     start_date: '2024-01-15',
  //     expected_end_date: '2024-06-30',
  //     client: 'MICLA Engineering',
  //     progress: 75,
  //     manager: {
  //       id: 1,
  //       username: 'joao',
  //       first_name: 'João',
  //       last_name: 'Silva',
  //       email: 'joao@example.com',
  //       full_name: 'João Silva'
  //     },
  //     tags: [
  //       { id: 1, name: 'Frontend', color: '#3f51b5' },
  //       { id: 2, name: 'Backend', color: '#f44336' },
  //       { id: 3, name: 'Angular', color: '#ff9800' },
  //       { id: 4, name: 'Django', color: '#4caf50' }
  //     ],
  //     members: [
  //       {
  //         id: 1,
  //         user: {
  //           id: 1,
  //           username: 'joao',
  //           first_name: 'João',
  //           last_name: 'Silva',
  //           email: 'joao@example.com',
  //           full_name: 'João Silva'
  //         },
  //         role: 'manager',
  //         role_display: 'Gerente',
  //         joined_at: '2024-01-15T10:00:00Z'
  //       },
  //       {
  //         id: 2,
  //         user: {
  //           id: 2,
  //           username: 'maria',
  //           first_name: 'Maria',
  //           last_name: 'Santos',
  //           email: 'maria@example.com',
  //           full_name: 'Maria Santos'
  //         },
  //         role: 'developer',
  //         role_display: 'Desenvolvedora',
  //         joined_at: '2024-01-16T10:00:00Z'
  //       },
  //       {
  //         id: 3,
  //         user: {
  //           id: 3,
  //           username: 'carlos',
  //           first_name: 'Carlos',
  //           last_name: 'Oliveira',
  //           email: 'carlos@example.com',
  //           full_name: 'Carlos Oliveira'
  //         },
  //         role: 'designer',
  //         role_display: 'Designer',
  //         joined_at: '2024-01-17T10:00:00Z'
  //       }
  //     ]
  //   };

  //   this.tasks = [
  //     {
  //       id: 1,
  //       title: 'Configurar ambiente de desenvolvimento',
  //       name: 'Configurar ambiente de desenvolvimento',
  //       description: 'Setup inicial do projeto Angular e Django',
  //       status: 'completed',
  //       priority: 'high',
  //       assigned_to: {
  //         id: 2,
  //         username: 'maria',
  //         first_name: 'Maria',
  //         last_name: 'Santos',
  //         email: 'maria@example.com',
  //         full_name: 'Maria Santos'
  //       },
  //       deadline: '2024-02-01',
  //       created_at: '2024-01-15T10:00:00Z',
  //       progress: 100,
  //       checklist: [
  //         { id: 1, item: 'Instalar Node.js e npm', completed: true },
  //         { id: 2, item: 'Configurar Angular CLI', completed: true },
  //         { id: 3, item: 'Criar projeto Angular', completed: true },
  //         { id: 4, item: 'Configurar Django backend', completed: true },
  //         { id: 5, item: 'Configurar banco de dados', completed: true }
  //       ]
  //     },
  //     {
  //       id: 2,
  //       title: 'Desenvolver tela de login',
  //       name: 'Desenvolver tela de login',
  //       description: 'Implementar autenticação e autorização',
  //       status: 'in_progress',
  //       priority: 'medium',
  //       assigned_to: {
  //         id: 2,
  //         username: 'maria',
  //         first_name: 'Maria',
  //         last_name: 'Santos',
  //         email: 'maria@example.com',
  //         full_name: 'Maria Santos'
  //       },
  //       deadline: '2024-02-15',
  //       created_at: '2024-01-16T10:00:00Z',
  //       progress: 85,
  //       checklist: [
  //         { id: 1, item: 'Criar componente de login', completed: true },
  //         { id: 2, item: 'Implementar formulário de login', completed: true },
  //         { id: 3, item: 'Integrar com API de autenticação', completed: true },
  //         { id: 4, item: 'Implementar guards de rota', completed: false },
  //         { id: 5, item: 'Adicionar validação de formulário', completed: false },
  //         { id: 6, item: 'Implementar recuperação de senha', completed: false }
  //       ]
  //     },
  //     {
  //       id: 3,
  //       title: 'Design do sistema',
  //       name: 'Design do sistema',
  //       description: 'Criar wireframes e protótipos',
  //       status: 'todo',
  //       priority: 'low',
  //       assigned_to: {
  //         id: 3,
  //         username: 'carlos',
  //         first_name: 'Carlos',
  //         last_name: 'Oliveira',
  //         email: 'carlos@example.com',
  //         full_name: 'Carlos Oliveira'
  //       },
  //       deadline: '2024-02-20',
  //       created_at: '2024-01-17T10:00:00Z',
  //       progress: 30,
  //       checklist: [
  //         { id: 1, item: 'Criar wireframes das telas principais', completed: true },
  //         { id: 2, item: 'Definir paleta de cores', completed: true },
  //         { id: 3, item: 'Criar protótipo interativo', completed: false },
  //         { id: 4, item: 'Revisar com stakeholders', completed: false },
  //         { id: 5, item: 'Criar guia de estilo', completed: false }
  //       ]
  //     }
  //   ];

  //   this.timeEntries = [
  //     {
  //       id: 1,
  //       user: {
  //         id: 2,
  //         username: 'maria',
  //         first_name: 'Maria',
  //         last_name: 'Santos',
  //         email: 'maria@example.com',
  //         full_name: 'Maria Santos'
  //       },
  //       date: '2024-01-20',
  //       hours: 8,
  //       activity_type: 'development',
  //       activity_type_display: 'Desenvolvimento',
  //       description: 'Implementação da tela de login e configuração do Angular',
  //       created_at: '2024-01-20T18:00:00Z'
  //     },
  //     {
  //       id: 2,
  //       user: {
  //         id: 1,
  //         username: 'joao',
  //         first_name: 'João',
  //         last_name: 'Silva',
  //         email: 'joao@example.com',
  //         full_name: 'João Silva'
  //       },
  //       date: '2024-01-21',
  //       hours: 6,
  //       activity_type: 'meeting',
  //       activity_type_display: 'Reunião',
  //       description: 'Reunião de planejamento com o cliente',
  //       created_at: '2024-01-21T15:00:00Z'
  //     },
  //     {
  //       id: 3,
  //       user: {
  //         id: 3,
  //         username: 'carlos',
  //         first_name: 'Carlos',
  //         last_name: 'Oliveira',
  //         email: 'carlos@example.com',
  //         full_name: 'Carlos Oliveira'
  //       },
  //       date: '2024-01-22',
  //       hours: 4,
  //       activity_type: 'design',
  //       activity_type_display: 'Design',
  //       description: 'Criação de mockups para as telas principais',
  //       created_at: '2024-01-22T12:00:00Z'
  //     }
  //   ];

  //   this.attachments = [
  //     {
  //       id: 1,
  //       name: 'Especificacao_Tecnica.pdf',
  //       file: '/assets/files/spec.pdf',
  //       file_type: 'pdf',
  //       file_size: 2621440,
  //       uploaded_by: {
  //         id: 1,
  //         username: 'joao',
  //         first_name: 'João',
  //         last_name: 'Silva',
  //         email: 'joao@example.com',
  //         full_name: 'João Silva'
  //       },
  //       uploaded_at: '2024-01-15T12:00:00Z'
  //     },
  //     {
  //       id: 2,
  //       name: 'Wireframes_Sistema.fig',
  //       file: '/assets/files/wireframes.fig',
  //       file_type: 'figma',
  //       file_size: 5242880,
  //       uploaded_by: {
  //         id: 3,
  //         username: 'carlos',
  //         first_name: 'Carlos',
  //         last_name: 'Oliveira',
  //         email: 'carlos@example.com',
  //         full_name: 'Carlos Oliveira'
  //       },
  //       uploaded_at: '2024-01-18T14:30:00Z'
  //     },
  //     {
  //       id: 3,
  //       name: 'Database_Schema.sql',
  //       file: '/assets/files/schema.sql',
  //       file_type: 'sql',
  //       file_size: 15360,
  //       uploaded_by: {
  //         id: 2,
  //         username: 'maria',
  //         first_name: 'Maria',
  //         last_name: 'Santos',
  //         email: 'maria@example.com',
  //         full_name: 'Maria Santos'
  //       },
  //       uploaded_at: '2024-01-19T16:45:00Z'
  //     }
  //   ];

  //   this.comments = [
  //     {
  //       id: 1,
  //       user: {
  //         id: 1,
  //         username: 'joao',
  //         first_name: 'João',
  //         last_name: 'Silva',
  //         email: 'joao@example.com',
  //         full_name: 'João Silva'
  //       },
  //       content: 'Pessoal, precisamos acelerar o desenvolvimento da API. O cliente quer uma demo na próxima semana.',
  //       message: 'Pessoal, precisamos acelerar o desenvolvimento da API. O cliente quer uma demo na próxima semana.',
  //       created_at: '2024-01-20T14:30:00Z'
  //     },
  //     {
  //       id: 2,
  //       user: {
  //         id: 2,
  //         username: 'maria',
  //         first_name: 'Maria',
  //         last_name: 'Santos',
  //         email: 'maria@example.com',
  //         full_name: 'Maria Santos'
  //       },
  //       content: 'Já terminei a configuração do ambiente. Posso começar com as APIs hoje mesmo.',
  //       message: 'Já terminei a configuração do ambiente. Posso começar com as APIs hoje mesmo.',
  //       created_at: '2024-01-20T15:15:00Z'
  //     },
  //     {
  //       id: 3,
  //       user: {
  //         id: 3,
  //         username: 'carlos',
  //         first_name: 'Carlos',
  //         last_name: 'Oliveira',
  //         email: 'carlos@example.com',
  //         full_name: 'Carlos Oliveira'
  //       },
  //       content: 'Os wireframes estão quase prontos. Vou finalizar hoje e já compartilho com vocês.',
  //       message: 'Os wireframes estão quase prontos. Vou finalizar hoje e já compartilho com vocês.',
  //       created_at: '2024-01-22T10:00:00Z'
  //     }
  //   ];

  //   this.activityLog = [
  //     {
  //       id: 1,
  //       user: {
  //         id: 2,
  //         username: 'maria',
  //         first_name: 'Maria',
  //         last_name: 'Santos',
  //         email: 'maria@example.com',
  //         full_name: 'Maria Santos'
  //       },
  //       action: 'task_completed',
  //       action_display: 'Tarefa concluída',
  //       target: 'Configurar ambiente de desenvolvimento',
  //       description: 'Tarefa concluída com sucesso',
  //       created_at: '2024-01-20T16:30:00Z',
  //       timestamp: '2024-01-20T16:30:00Z',
  //       details: { task_id: 1 }
  //     },
  //     {
  //       id: 2,
  //       user: {
  //         id: 3,
  //         username: 'carlos',
  //         first_name: 'Carlos',
  //         last_name: 'Oliveira',
  //         email: 'carlos@example.com',
  //         full_name: 'Carlos Oliveira'
  //       },
  //       action: 'file_uploaded',
  //       action_display: 'Arquivo enviado',
  //       target: 'Wireframes_Sistema.fig',
  //       description: 'Arquivo de wireframes enviado',
  //       created_at: '2024-01-18T14:30:00Z',
  //       timestamp: '2024-01-18T14:30:00Z',
  //       details: { file_id: 2 }
  //     },
  //     {
  //       id: 3,
  //       user: {
  //         id: 1,
  //         username: 'joao',
  //         first_name: 'João',
  //         last_name: 'Silva',
  //         email: 'joao@example.com',
  //         full_name: 'João Silva'
  //       },
  //       action: 'project_created',
  //       action_display: 'Projeto criado',
  //       target: 'Sistema de Gestão MICLA',
  //       description: 'Projeto criado com sucesso',
  //       created_at: '2024-01-15T10:00:00Z',
  //       timestamp: '2024-01-15T10:00:00Z',
  //       details: { project_id: this.projectId }
  //     }
  //   ];

  //   this.isLoading = false;
  // }

  getStatusColor(status: string): string {
    return this.projectsService.getStatusColor(status);
  }

  getPriorityColor(priority: string): string {
    return this.projectsService.getPriorityColor(priority);
  }

  getPriorityDisplayName(priority: string): string {
    return this.projectsService.getPriorityDisplayName(priority);
  }

  getFileIcon(type: string | undefined): string {
    if (!type) return 'attachment';
    switch (type) {
      case 'pdf': return 'picture_as_pdf';
      case 'doc': return 'description';
      case 'image': return 'image';
      case 'sql': return 'storage';
      default: return 'attachment';
    }
  }

  getActivityIcon(type: string): string {
    switch (type) {
      case 'task_completed': return 'check_circle';
      case 'project_status_changed': return 'flag';
      case 'file_uploaded': return 'cloud_upload';
      case 'comment_added': return 'comment';
      case 'member_added': return 'person_add';
      case 'member_removed': return 'person_remove';
      default: return 'info';
    }
  }

  getTotalHours(): number {
    return this.timeEntries.reduce((total, entry) => total + entry.hours, 0);
  }

  onEditProject(): void {
    if (this.projectId) {
      this.router.navigate(['/projects', this.projectId, 'edit']);
    }
  }

  onArchiveProject(): void {
    if (!this.projectId) return;

    if (confirm('Tem certeza que deseja arquivar este projeto?')) {
      // Simular arquivamento hardcoded
      this.project.status = 'on_hold';
      this.showSnackBar('Projeto arquivado com sucesso!', 'success');
    }
  }

  onDeleteProject(): void {
    if (!this.projectId) return;

    if (confirm(`Tem certeza que deseja excluir o projeto "${this.project.name}"?`)) {
      // Simular exclusão hardcoded
      this.showSnackBar('Projeto excluído com sucesso!', 'success');
      this.router.navigate(['/projects']);
    }
  }

  formatDate(date: string): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('pt-BR');
  }

  formatDateTime(date: string): string {
    if (!date) return '';
    return new Date(date).toLocaleString('pt-BR');
  }

  formatFileSize(bytes: number | undefined): string {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  getUserInitials(user: any): string {
    if (typeof user === 'string') {
      return user.charAt(0).toUpperCase();
    }
    return `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`.toUpperCase();
  }

  toggleChecklistItem(taskId: number, itemIndex: number): void {
    const task = this.tasks.find(t => t.id === taskId);
    if (task && task.checklist && task.checklist[itemIndex]) {
      task.checklist[itemIndex].completed = !task.checklist[itemIndex].completed;
      this.showSnackBar('Item da checklist atualizado!', 'success');
    }
  }

  addChecklistItem(taskId: number): void {
    const task = this.tasks.find(t => t.id === taskId);
    if (!task) return;

    const newItem = prompt('Digite o texto do novo item:');
    if (newItem && newItem.trim()) {
      if (!task.checklist) {
        task.checklist = [];
      }
      task.checklist.push({
        id: Date.now(),
        item: newItem.trim(),
        completed: false
      });
      this.showSnackBar('Item adicionado à checklist!', 'success');
    }
  }

  removeChecklistItem(taskId: number, itemIndex: number): void {
    const task = this.tasks.find(t => t.id === taskId);
    if (!task || !task.checklist || !task.checklist[itemIndex]) return;

    if (confirm('Tem certeza que deseja remover este item da checklist?')) {
      task.checklist.splice(itemIndex, 1);
      this.showSnackBar('Item removido da checklist!', 'success');
    }
  }

  // ===== GESTÃO DE MEMBROS DA EQUIPE =====
  onAddTeamMember(): void {
    // Simular adição de membro hardcoded
    const newMember = {
      id: Date.now(),
      user: {
        id: Date.now(),
        username: 'novo_usuario',
        first_name: 'Novo',
        last_name: 'Usuário',
        email: 'novo@example.com',
        full_name: 'Novo Usuário'
      },
      role: 'developer',
      role_display: 'Desenvolvedor',
      joined_at: new Date().toISOString()
    };

    this.project.members = [...(this.project.members || []), newMember];
    this.showSnackBar('Membro adicionado à equipe com sucesso!', 'success');
  }

  onRemoveTeamMember(memberId: number): void {
    if (!this.projectId) return;

    if (confirm('Tem certeza que deseja remover este membro da equipe?')) {
      // Simular remoção hardcoded
      this.project.members = this.project.members?.filter(m => m.id !== memberId);
      this.showSnackBar('Membro removido da equipe com sucesso!', 'success');
    }
  }

  // ===== GESTÃO DE TAGS =====
  onAddTag(): void {
    // Simular adição de tag hardcoded
    const colors = ['#3f51b5', '#f44336', '#ff9800', '#4caf50', '#9c27b0', '#e91e63'];
    const newTag = {
      id: Date.now(),
      name: 'Nova Tag',
      color: colors[Math.floor(Math.random() * colors.length)]
    };

    this.project.tags = [...(this.project.tags || []), newTag];
    this.showSnackBar('Tag adicionada com sucesso!', 'success');
  }

  onRemoveTag(tagId: number): void {
    if (!this.projectId) return;

    if (confirm('Tem certeza que deseja remover esta tag?')) {
      // Simular remoção hardcoded
      this.project.tags = this.project.tags?.filter(t => t.id !== tagId);
      this.showSnackBar('Tag removida com sucesso!', 'success');
    }
  }

  // ===== GESTÃO DE TAREFAS =====
  onAddTask(): void {
    // Simular adição de tarefa hardcoded
    const newTask = {
      id: Date.now(),
      title: 'Nova Tarefa',
      name: 'Nova Tarefa',
      description: 'Descrição da nova tarefa',
      status: 'todo',
      priority: 'medium',
      assigned_to: this.project.members?.[0]?.user || null,
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      created_at: new Date().toISOString(),
      progress: 0
    };

    this.tasks = [...this.tasks, newTask];
    this.showSnackBar('Tarefa criada com sucesso!', 'success');
  }

  onEditTask(taskId: number): void {
    // Simulação simples - apenas mostra console log
    console.log('Editar tarefa:', taskId);
    this.showSnackBar('Funcionalidade de edição em desenvolvimento!', 'success');
  }

  onDeleteTask(taskId: number): void {
    const task = this.tasks.find(t => t.id === taskId);
    if (!task) return;

    if (confirm(`Tem certeza que deseja excluir a tarefa "${task.name}"?`)) {
      // Simular exclusão hardcoded
      this.tasks = this.tasks.filter(t => t.id !== taskId);
      this.showSnackBar('Tarefa excluída com sucesso!', 'success');
    }
  }

  toggleTaskStatus(taskId: number): void {
    const task = this.tasks.find(t => t.id === taskId);
    if (!task) return;

    // Simular toggle hardcoded
    const newStatus = task.status === 'completed' ? 'todo' : 'completed';
    const newProgress = newStatus === 'completed' ? 100 : 50;

    task.status = newStatus;
    task.progress = newProgress;

    this.showSnackBar(`Tarefa ${newStatus === 'completed' ? 'concluída' : 'reaberta'} com sucesso!`, 'success');
  }

  // ===== GESTÃO DE TEMPO =====
  onAddTimeEntry(): void {
    // Simular adição de registro de tempo hardcoded
    const newTimeEntry = {
      id: Date.now(),
      user: this.project.members?.[0]?.user || {
        id: 1,
        username: 'usuario',
        first_name: 'Usuário',
        last_name: 'Atual',
        email: 'usuario@example.com',
        full_name: 'Usuário Atual'
      },
      date: new Date().toISOString().split('T')[0],
      hours: 8,
      activity_type: 'development',
      activity_type_display: 'Desenvolvimento',
      description: 'Trabalho no projeto',
      created_at: new Date().toISOString()
    };

    this.timeEntries = [...this.timeEntries, newTimeEntry];
    this.showSnackBar('Tempo registrado com sucesso!', 'success');
  }

  onEditTimeEntry(entryId: number): void {
    // Simulação simples - apenas mostra console log
    console.log('Editar registro de tempo:', entryId);
    this.showSnackBar('Funcionalidade de edição em desenvolvimento!', 'success');
  }

  onDeleteTimeEntry(entryId: number): void {
    const entry = this.timeEntries.find(e => e.id === entryId);
    if (!entry) return;

    if (confirm('Tem certeza que deseja excluir este registro de tempo?')) {
      // Simular exclusão hardcoded
      this.timeEntries = this.timeEntries.filter(e => e.id !== entryId);
      this.showSnackBar('Registro de tempo excluído com sucesso!', 'success');
    }
  }

  // ===== GESTÃO DE ANEXOS =====
  onUploadFile(): void {
    // Simular upload de arquivo hardcoded
    const newAttachment = {
      id: Date.now(),
      name: 'arquivo_exemplo.pdf',
      file: '/assets/files/exemplo.pdf',
      file_type: 'pdf',
      file_size: 1024000,
      uploaded_by: this.project.members?.[0]?.user || {
        id: 1,
        username: 'usuario',
        first_name: 'Usuário',
        last_name: 'Atual',
        email: 'usuario@example.com',
        full_name: 'Usuário Atual'
      },
      uploaded_at: new Date().toISOString()
    };

    this.attachments = [...this.attachments, newAttachment];
    this.showSnackBar('Arquivo enviado com sucesso!', 'success');
  }

  onDownloadFile(attachmentId: number): void {
    const attachment = this.attachments.find(a => a.id === attachmentId);
    if (!attachment) return;

    // Simular download hardcoded
    this.showSnackBar(`Download do arquivo "${attachment.name}" iniciado!`, 'success');
  }

  onDeleteFile(attachmentId: number): void {
    const attachment = this.attachments.find(a => a.id === attachmentId);
    if (!attachment) return;

    if (confirm(`Tem certeza que deseja excluir o arquivo "${attachment.name}"?`)) {
      // Simular exclusão hardcoded
      this.attachments = this.attachments.filter(a => a.id !== attachmentId);
      this.showSnackBar('Arquivo excluído com sucesso!', 'success');
    }
  }

  // ===== GESTÃO DE COMENTÁRIOS =====
  addComment(): void {
    if (!this.newComment.trim() || !this.projectId) return;

    // Simular adição de comentário hardcoded
    const newComment = {
      id: Date.now(),
      user: this.project.members?.[0]?.user || {
        id: 1,
        username: 'usuario',
        first_name: 'Usuário',
        last_name: 'Atual',
        email: 'usuario@example.com',
        full_name: 'Usuário Atual'
      },
      content: this.newComment.trim(),
      message: this.newComment.trim(),
      created_at: new Date().toISOString()
    };

    this.comments.unshift(newComment);
    this.newComment = '';
    this.showSnackBar('Comentário adicionado com sucesso!', 'success');
  }

  onEditComment(commentId: number): void {
    // Simulação simples - apenas mostra console log
    console.log('Editar comentário:', commentId);
    this.showSnackBar('Funcionalidade de edição em desenvolvimento!', 'success');
  }

  onDeleteComment(commentId: number): void {
    const comment = this.comments.find(c => c.id === commentId);
    if (!comment) return;

    if (confirm('Tem certeza que deseja excluir este comentário?')) {
      // Simular exclusão hardcoded
      this.comments = this.comments.filter(c => c.id !== commentId);
      this.showSnackBar('Comentário excluído com sucesso!', 'success');
    }
  }

  // ===== MÉTODOS AUXILIARES =====
  canEditProject(): boolean {
    // TODO: Implementar verificação de permissão
    return true;
  }

  canManageTeam(): boolean {
    // TODO: Implementar verificação de permissão
    return true;
  }

  canAddTasks(): boolean {
    // TODO: Implementar verificação de permissão
    return true;
  }

  getActivityTypeDisplay(activityType: string): string {
    const types: { [key: string]: string } = {
      'development': 'Desenvolvimento',
      'design': 'Design',
      'testing': 'Testes',
      'analysis': 'Análise',
      'meeting': 'Reunião',
      'documentation': 'Documentação',
      'other': 'Outro'
    };
    return types[activityType] || activityType;
  }

  refreshData(): void {
    // Simular refresh hardcoded
    this.showSnackBar('Dados atualizados!', 'success');
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

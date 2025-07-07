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
  User
} from '../../../services/projects.service';
import { TagTeamComponent } from './components/tag-team/tag-team.component';

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
    MatSnackBarModule,
    TagTeamComponent
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
  showAddTagDialog = false;
  timeEntries: TimeEntry[] = [];
  attachments: ProjectAttachment[] = [];
  comments: ProjectComment[] = [];
  activityLog: ActivityLog[] = [];

  newComment = '';
  isLoading = false;

  private destroy$ = new Subject<void>();
  public projectId: number | null = null;

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

  onProjectChange(updatedProject: Project): void {
    this.project = updatedProject;
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

  // ===== MÉTODOS DAS TAGS =====
  onAddTag(): void {
    this.showAddTagDialog = true;
  }

  onCloseAddTagDialog(): void {
    this.showAddTagDialog = false;
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

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

// Interfaces
export interface Project {
  id: number;
  name: string;
  description: string;
  start_date: string;
  end_date?: string;
  expected_end_date?: string;
  status: string;
  priority?: string;
  progress: number;
  client?: string;
  manager?: User;
  manager_id?: number;
  members?: TeamMember[];
  team_members?: TeamMember[];
  tags?: Tag[];
  tasks?: Task[];
  time_entries?: TimeEntry[];
  attachments?: Attachment[];
  comments?: Comment[];
  activity_log?: ActivityLog[];
}

export interface TeamMember {
  id: number;
  user: User;
  role: string;
  role_display?: string;
  added_at?: string;
  joined_at?: string;
  project?: number;
}

export interface ProjectMember extends TeamMember {}

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name?: string;
}

export interface Tag {
  id: number;
  name: string;
  color: string;
  project?: number;
}

export interface ProjectTag extends Tag {}

export interface Task {
  id: number;
  title?: string;
  name?: string;
  description: string;
  status: string;
  priority: string;
  assigned_to: User | null;
  created_at: string;
  updated_at?: string;
  completed_at?: string;
  due_date?: string;
  deadline?: string;
  progress?: number;
  checklist?: any[];
  project?: number;
}

export interface TimeEntry {
  id: number;
  description: string;
  hours: number;
  date: string;
  user: User;
  task?: Task | null;
  activity_type?: string;
  activity_type_display?: string;
  created_at?: string;
  project?: number;
}

export interface Attachment {
  id: number;
  name: string;
  file: string;
  file_url?: string;
  file_type?: string;
  file_size?: number;
  uploaded_at: string;
  uploaded_by: User;
  project?: number;
}

export interface ProjectAttachment extends Attachment {}

export interface Comment {
  id: number;
  content?: string;
  message?: string;
  created_at: string;
  updated_at?: string;
  user: User;
  project?: number;
}

export interface ProjectComment extends Comment {}

export interface ActivityLog {
  id: number;
  action: string;
  timestamp?: string;
  created_at?: string;
  user: User;
  details?: any;
  description?: string;
  action_display?: string;
  target?: string;
  project?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  private baseUrl = 'http://localhost:8000/api/projects'; // URL original
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  // Project CRUD operations - HARDCODED
  getProjects(): Observable<Project[]> {
    const hardcodedProjects: Project[] = [
      {
        id: 1,
        name: 'Sistema de Gestão MICLA',
        description: 'Desenvolvimento completo de sistema de gestão de projetos',
        status: 'in_progress',
        priority: 'high',
        start_date: '2024-01-15',
        expected_end_date: '2024-06-30',
        client: 'MICLA Engineering',
        progress: 65
      },
      {
        id: 2,
        name: 'Website Corporativo',
        description: 'Desenvolvimento do novo website da empresa',
        status: 'completed',
        priority: 'medium',
        start_date: '2024-02-01',
        expected_end_date: '2024-04-30',
        client: 'Cliente XYZ',
        progress: 100
      }
    ];
    return of(hardcodedProjects);
  }

  getProject(id: number): Observable<Project> {
    const hardcodedProject: Project = {
      id: id,
      name: 'Sistema de Gestão MICLA',
      description: 'Desenvolvimento completo de sistema de gestão de projetos para a empresa MICLA Engineering & Design',
      status: 'in_progress',
      priority: 'high',
      start_date: '2024-01-15',
      expected_end_date: '2024-06-30',
      client: 'MICLA Engineering',
      progress: 65,
      manager: {
        id: 1,
        username: 'joao',
        first_name: 'João',
        last_name: 'Silva',
        email: 'joao@example.com',
        full_name: 'João Silva'
      },
      tags: [
        { id: 1, name: 'Frontend', color: '#3f51b5' },
        { id: 2, name: 'Backend', color: '#f44336' },
        { id: 3, name: 'Angular', color: '#ff9800' },
        { id: 4, name: 'Django', color: '#4caf50' }
      ],
      members: [
        {
          id: 1,
          user: {
            id: 1,
            username: 'joao',
            first_name: 'João',
            last_name: 'Silva',
            email: 'joao@example.com',
            full_name: 'João Silva'
          },
          role: 'manager',
          role_display: 'Gerente',
          joined_at: '2024-01-15T10:00:00Z'
        },
        {
          id: 2,
          user: {
            id: 2,
            username: 'maria',
            first_name: 'Maria',
            last_name: 'Santos',
            email: 'maria@example.com',
            full_name: 'Maria Santos'
          },
          role: 'developer',
          role_display: 'Desenvolvedor',
          joined_at: '2024-01-16T10:00:00Z'
        }
      ]
    };
    return of(hardcodedProject);
  }

  createProject(project: Partial<Project>): Observable<Project> {
    const newProject: Project = {
      id: Math.floor(Math.random() * 1000),
      name: project.name || '',
      description: project.description || '',
      status: project.status || 'planning',
      start_date: project.start_date || new Date().toISOString().split('T')[0],
      progress: 0,
      ...project
    } as Project;
    return of(newProject);
  }

  updateProject(id: number, project: Partial<Project>): Observable<Project> {
    return this.getProject(id);
  }

  deleteProject(id: number): Observable<void> {
    return of(void 0);
  }

  // Tasks - HARDCODED
  getTasks(projectId: number): Observable<Task[]> {
    const hardcodedTasks: Task[] = [
      {
        id: 1,
        title: 'Configurar ambiente de desenvolvimento',
        name: 'Configurar ambiente de desenvolvimento',
        description: 'Setup inicial do projeto',
        status: 'completed',
        priority: 'high',
        assigned_to: {
          id: 2,
          username: 'maria',
          first_name: 'Maria',
          last_name: 'Santos',
          email: 'maria@example.com',
          full_name: 'Maria Santos'
        },
        deadline: '2024-02-01',
        created_at: '2024-01-15T10:00:00Z',
        progress: 100
      },
      {
        id: 2,
        title: 'Desenvolver tela de login',
        name: 'Desenvolver tela de login',
        description: 'Implementar autenticação',
        status: 'in_progress',
        priority: 'medium',
        assigned_to: {
          id: 2,
          username: 'maria',
          first_name: 'Maria',
          last_name: 'Santos',
          email: 'maria@example.com',
          full_name: 'Maria Santos'
        },
        deadline: '2024-02-15',
        created_at: '2024-01-16T10:00:00Z',
        progress: 85
      }
    ];
    return of(hardcodedTasks);
  }

  createTask(projectId: number, task: Partial<Task>): Observable<Task> {
    const newTask: Task = {
      id: Math.floor(Math.random() * 1000),
      title: task.title || task.name || '',
      name: task.name || task.title || '',
      description: task.description || '',
      status: task.status || 'todo',
      priority: task.priority || 'medium',
      assigned_to: task.assigned_to || null,
      created_at: new Date().toISOString(),
      deadline: task.deadline,
      progress: 0
    };
    return of(newTask);
  }

  updateTask(projectId: number, taskId: number, task: Partial<Task>): Observable<Task> {
    return of({
      id: taskId,
      title: 'Tarefa atualizada',
      name: 'Tarefa atualizada',
      description: 'Descrição atualizada',
      status: task.status || 'in_progress',
      priority: 'medium',
      assigned_to: null,
      created_at: new Date().toISOString(),
      progress: task.progress || 50
    });
  }

  deleteTask(projectId: number, taskId: number): Observable<void> {
    return of(void 0);
  }

  // Time Entries - HARDCODED
  getTimeEntries(projectId: number): Observable<TimeEntry[]> {
    const hardcodedTimeEntries: TimeEntry[] = [
      {
        id: 1,
        user: {
          id: 2,
          username: 'maria',
          first_name: 'Maria',
          last_name: 'Santos',
          email: 'maria@example.com',
          full_name: 'Maria Santos'
        },
        date: '2024-01-20',
        hours: 8,
        activity_type: 'development',
        activity_type_display: 'Desenvolvimento',
        description: 'Implementação da tela de login',
        created_at: '2024-01-20T18:00:00Z'
      }
    ];
    return of(hardcodedTimeEntries);
  }

  createTimeEntry(projectId: number, timeEntry: Partial<TimeEntry>): Observable<TimeEntry> {
    const newTimeEntry: TimeEntry = {
      id: Math.floor(Math.random() * 1000),
      user: {
        id: 1,
        username: 'current_user',
        first_name: 'Usuário',
        last_name: 'Atual',
        email: 'user@example.com',
        full_name: 'Usuário Atual'
      },
      date: timeEntry.date || new Date().toISOString().split('T')[0],
      hours: timeEntry.hours || 0,
      description: timeEntry.description || '',
      activity_type: timeEntry.activity_type || 'development',
      activity_type_display: timeEntry.activity_type_display || 'Desenvolvimento',
      created_at: new Date().toISOString()
    };
    return of(newTimeEntry);
  }

  deleteTimeEntry(projectId: number, timeEntryId: number): Observable<void> {
    return of(void 0);
  }

  // Attachments - HARDCODED
  getAttachments(projectId: number): Observable<Attachment[]> {
    const hardcodedAttachments: Attachment[] = [
      {
        id: 1,
        name: 'Especificação_Técnica.pdf',
        file: '/assets/files/spec.pdf',
        file_url: '/assets/files/spec.pdf',
        file_type: 'pdf',
        file_size: 2621440,
        uploaded_by: {
          id: 1,
          username: 'joao',
          first_name: 'João',
          last_name: 'Silva',
          email: 'joao@example.com',
          full_name: 'João Silva'
        },
        uploaded_at: '2024-01-15T12:00:00Z'
      }
    ];
    return of(hardcodedAttachments);
  }

  createAttachment(projectId: number, formData: FormData): Observable<Attachment> {
    const file = formData.get('file') as File;
    const newAttachment: Attachment = {
      id: Math.floor(Math.random() * 1000),
      name: file?.name || 'arquivo.txt',
      file: '/assets/files/uploaded.txt',
      file_url: '/assets/files/uploaded.txt',
      file_type: file?.type?.split('/')[1] || 'txt',
      file_size: file?.size || 1024,
      uploaded_by: {
        id: 1,
        username: 'current_user',
        first_name: 'Usuário',
        last_name: 'Atual',
        email: 'user@example.com',
        full_name: 'Usuário Atual'
      },
      uploaded_at: new Date().toISOString()
    };
    return of(newAttachment);
  }

  downloadAttachment(projectId: number, attachmentId: number): Observable<Blob> {
    const blob = new Blob(['Conteúdo do arquivo'], { type: 'text/plain' });
    return of(blob);
  }

  deleteAttachment(projectId: number, attachmentId: number): Observable<void> {
    return of(void 0);
  }

  // Comments - HARDCODED
  getComments(projectId: number): Observable<Comment[]> {
    const hardcodedComments: Comment[] = [
      {
        id: 1,
        user: {
          id: 1,
          username: 'joao',
          first_name: 'João',
          last_name: 'Silva',
          email: 'joao@example.com',
          full_name: 'João Silva'
        },
        content: 'Pessoal, precisamos acelerar o desenvolvimento da API.',
        message: 'Pessoal, precisamos acelerar o desenvolvimento da API.',
        created_at: '2024-01-20T14:30:00Z'
      }
    ];
    return of(hardcodedComments);
  }

  createComment(projectId: number, comment: Partial<Comment>): Observable<Comment> {
    const newComment: Comment = {
      id: Math.floor(Math.random() * 1000),
      user: {
        id: 1,
        username: 'current_user',
        first_name: 'Usuário',
        last_name: 'Atual',
        email: 'user@example.com',
        full_name: 'Usuário Atual'
      },
      content: comment.message || comment.content || '',
      message: comment.message || comment.content || '',
      created_at: new Date().toISOString()
    };
    return of(newComment);
  }

  deleteComment(projectId: number, commentId: number): Observable<void> {
    return of(void 0);
  }

  // Activity Log - HARDCODED
  getActivityLogs(projectId: number): Observable<ActivityLog[]> {
    const hardcodedActivityLog: ActivityLog[] = [
      {
        id: 1,
        user: {
          id: 2,
          username: 'maria',
          first_name: 'Maria',
          last_name: 'Santos',
          email: 'maria@example.com',
          full_name: 'Maria Santos'
        },
        action: 'task_completed',
        action_display: 'Tarefa concluída',
        target: 'Configurar ambiente de desenvolvimento',
        description: 'Tarefa concluída com sucesso',
        created_at: '2024-01-20T16:30:00Z',
        timestamp: '2024-01-20T16:30:00Z',
        details: { task_id: 1 }
      }
    ];
    return of(hardcodedActivityLog);
  }

  // Team Members - HARDCODED
  addProjectMember(projectId: number, teamMember: Partial<TeamMember>): Observable<TeamMember> {
    const newMember: TeamMember = {
      id: Math.floor(Math.random() * 1000),
      user: {
        id: Math.floor(Math.random() * 1000),
        username: 'new_user',
        first_name: 'Novo',
        last_name: 'Usuário',
        email: 'novo@example.com',
        full_name: 'Novo Usuário'
      },
      role: teamMember.role || 'developer',
      role_display: teamMember.role_display || 'Desenvolvedor',
      joined_at: new Date().toISOString()
    };
    return of(newMember);
  }

  removeProjectMember(projectId: number, teamMemberId: number): Observable<void> {
    return of(void 0);
  }

  // Tags - HARDCODED
  createTag(tag: Partial<Tag>): Observable<Tag> {
    const newTag: Tag = {
      id: Math.floor(Math.random() * 1000),
      name: tag.name || '',
      color: tag.color || '#3f51b5'
    };
    return of(newTag);
  }

  addProjectTag(projectId: number, tagId: number): Observable<void> {
    return of(void 0);
  }

  removeProjectTag(projectId: number, tagId: number): Observable<void> {
    return of(void 0);
  }

  // Helper methods for UI
  getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'active': return 'status-active';
      case 'in_progress': return 'status-in-progress';
      case 'completed': return 'status-completed';
      case 'on_hold': return 'status-on-hold';
      case 'cancelled': return 'status-cancelled';
      default: return 'status-default';
    }
  }

  getPriorityColor(priority: string): string {
    switch (priority.toLowerCase()) {
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return 'priority-default';
    }
  }

  getStatusDisplayName(status: string): string {
    switch (status.toLowerCase()) {
      case 'active': return 'Ativo';
      case 'in_progress': return 'Em Andamento';
      case 'completed': return 'Concluído';
      case 'on_hold': return 'Em Espera';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  }

  getPriorityDisplayName(priority: string): string {
    switch (priority.toLowerCase()) {
      case 'high': return 'Alta';
      case 'medium': return 'Média';
      case 'low': return 'Baixa';
      default: return priority;
    }
  }
}

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
  status_display: string;
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
  status_display?: string;
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
  private baseUrl = 'http://localhost:8000/api/projects/'; // URL original

  constructor(private http: HttpClient) {}

  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.baseUrl}`);
  }

  createProject(project: Partial<Project>): Observable<Project>{
    return this.http.post<Project>(`${this.baseUrl}`, project);
  }

  deleteProject(projectId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}${projectId}/`);
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

  getPriorityDisplayName(priority: string): string {
    switch (priority.toLowerCase()) {
      case 'high': return 'Alta';
      case 'medium': return 'Média';
      case 'low': return 'Baixa';
      default: return priority;
    }
  }
}

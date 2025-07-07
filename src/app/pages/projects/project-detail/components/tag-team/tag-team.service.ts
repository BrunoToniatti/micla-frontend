import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Tag {
  id: number;
  name: string;
  color: string;
  porjectId: number;
}

export interface ProjectTag extends Tag {}

@Injectable({
  providedIn: 'root'
})
export class TagTeamService {

  constructor(
    private http: HttpClient
  ) { }

  createTag(data: Partial<Tag>): Observable<Tag> {
    return this.http.post<Tag>('http://localhost:8000/api/projects/tags/', data);
  }
}

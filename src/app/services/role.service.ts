import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

export interface Role{
  name: string;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
  ) { }

  url = ''

  newRole(role: Role){
    console.log('esta vindo aqui')
    return this.http.post(`${this.apiUrl}accounts/roles/`, role)
  }

  getRoles(){
    return this.http.get(`${this.apiUrl}accounts/roles/`)
  }

  deleteRole(id: number){
    return this.http.delete(`${this.apiUrl}accounts/roles/${id}/`)
  }
}

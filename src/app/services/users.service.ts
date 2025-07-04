import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

export interface Role {
  id: number;
  name: string;
  description: string;
}

export interface User {
  first_name: string;
  last_name: string;
  password: string;
  token: string;
  profile?: {
    role: Role;
  };
}

export interface Invite {
  email: string,
  role: number
}

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(
    private http: HttpClient
  ) { }

  apiUrl = environment.apiUrl + 'accounts/users/';

  inviteUrl = environment.apiUrl + 'accounts/invites/';

  activateUrl = environment.apiUrl + 'accounts/activate/';

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}`)
  }
  createUser(user: User) {
    return this.http.post(`${this.activateUrl}`, user)
  }

  deleteUser(id: number) {
    return this.http.delete(`${this.apiUrl}${id}/`);
  }

  getInvites() {
    return this.http.get(`${this.inviteUrl}`)
  }
  createInvite(invite: Invite) {
    return this.http.post(`${this.inviteUrl}`, invite);
  }

  deleteInvite(id: number) {
    return this.http.delete(`${this.inviteUrl}${id}/`);
  }

}

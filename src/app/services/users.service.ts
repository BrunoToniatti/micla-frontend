import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

export interface User{
  first_name: string;
  last_name: string;
  password: string;
  token: string;
}

export interface Invite{
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

  getUsers() {
    return this.http.get(`${this.apiUrl}`)
  }
  createUser(user: User){
    return this.http.post(`${this.activateUrl}`, user)
  }

  getInvites(){
    return this.http.get(`${this.inviteUrl}`)
  }
  createInvite(invite: Invite){
    return this.http.post(`${this.inviteUrl}`, invite);
  }

}

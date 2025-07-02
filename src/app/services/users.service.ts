import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(
    private http: HttpClient
  ) { }

  apiUrl = environment.apiUrl + 'accounts/users/';

  getUsers() {
    return this.http.get(`${this.apiUrl}`)
  }
}

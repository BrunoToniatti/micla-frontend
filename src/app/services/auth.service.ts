import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }

  setToken(token: string): void {
    localStorage.setItem('access_token', token);
  }


  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }
}

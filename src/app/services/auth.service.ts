import { Injectable } from '@angular/core';
import { PermissionService } from './permission.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private permissionService: PermissionService) {}

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

  getUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    this.permissionService.clearPermissions();
  }

  loadPermissionsOnStartup(): void {
    const user = this.getUser();
    if (user && user.roles) {
      this.permissionService.setPermissions(user.roles);
    }
  }
}

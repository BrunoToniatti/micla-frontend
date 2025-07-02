// src/app/services/permission.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  private permissions: string[] = [];

  constructor() { }

  setPermissions(perms: string[]): void {
    this.permissions = perms.map(p => p.toUpperCase());
  }

  hasPermission(permission: string): boolean {
    return this.permissions.includes(permission.toUpperCase());
  }

  // (Opcional) Retorna todas as permissões
  getPermissions(): string[] {
    return this.permissions;
  }

  // (Opcional) Limpa as permissões (ex: logout)
  clearPermissions(): void {
    this.permissions = [];
  }
}

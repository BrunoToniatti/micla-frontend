import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';

export interface AddTeamMemberData {
  projectId: number;
}

@Component({
  selector: 'app-add-team-member-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule
  ],
  template: `
    <h2 mat-dialog-title>Adicionar Membro da Equipe</h2>
    <mat-dialog-content>
      <form [formGroup]="memberForm" class="member-form">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>E-mail do usuário</mat-label>
          <input matInput formControlName="email" type="email" placeholder="Digite o e-mail">
          <mat-error *ngIf="memberForm.get('email')?.hasError('required')">
            E-mail é obrigatório
          </mat-error>
          <mat-error *ngIf="memberForm.get('email')?.hasError('email')">
            Digite um e-mail válido
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Função</mat-label>
          <mat-select formControlName="role">
            <mat-option value="manager">Gerente</mat-option>
            <mat-option value="developer">Desenvolvedor</mat-option>
            <mat-option value="designer">Designer</mat-option>
            <mat-option value="tester">Testador</mat-option>
            <mat-option value="analyst">Analista</mat-option>
            <mat-option value="other">Outro</mat-option>
          </mat-select>
          <mat-error *ngIf="memberForm.get('role')?.hasError('required')">
            Função é obrigatória
          </mat-error>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancelar</button>
      <button mat-raised-button color="primary" (click)="onSave()" [disabled]="memberForm.invalid">
        Adicionar
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .member-form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      min-width: 300px;
    }

    .full-width {
      width: 100%;
    }

    mat-dialog-content {
      padding: 1rem 0;
    }
  `]
})
export class AddTeamMemberDialogComponent {
  memberForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddTeamMemberDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AddTeamMemberData
  ) {
    this.memberForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required]
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.memberForm.valid) {
      this.dialogRef.close(this.memberForm.value);
    }
  }
}

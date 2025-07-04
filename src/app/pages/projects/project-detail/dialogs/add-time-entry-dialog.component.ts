import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';

export interface AddTimeEntryData {
  projectId: number;
}

@Component({
  selector: 'app-add-time-entry-dialog',
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
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule
  ],
  template: `
    <h2 mat-dialog-title>Registrar Tempo</h2>
    <mat-dialog-content>
      <form [formGroup]="timeForm" class="time-form">
        <div class="form-row">
          <mat-form-field appearance="outline" class="half-width">
            <mat-label>Data</mat-label>
            <input matInput [matDatepicker]="picker" formControlName="date">
            <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
            <mat-datepicker #picker></mat-datepicker>
            <mat-error *ngIf="timeForm.get('date')?.hasError('required')">
              Data é obrigatória
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="half-width">
            <mat-label>Horas</mat-label>
            <input matInput type="number" formControlName="hours" placeholder="Ex: 8" min="0" max="24" step="0.5">
            <mat-error *ngIf="timeForm.get('hours')?.hasError('required')">
              Horas é obrigatório
            </mat-error>
            <mat-error *ngIf="timeForm.get('hours')?.hasError('min')">
              Mínimo 0 horas
            </mat-error>
            <mat-error *ngIf="timeForm.get('hours')?.hasError('max')">
              Máximo 24 horas
            </mat-error>
          </mat-form-field>
        </div>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Tipo de atividade</mat-label>
          <mat-select formControlName="activity_type">
            <mat-option value="development">Desenvolvimento</mat-option>
            <mat-option value="design">Design</mat-option>
            <mat-option value="testing">Testes</mat-option>
            <mat-option value="analysis">Análise</mat-option>
            <mat-option value="meeting">Reunião</mat-option>
            <mat-option value="documentation">Documentação</mat-option>
            <mat-option value="other">Outro</mat-option>
          </mat-select>
          <mat-error *ngIf="timeForm.get('activity_type')?.hasError('required')">
            Tipo de atividade é obrigatório
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Descrição</mat-label>
          <textarea matInput formControlName="description" rows="3" placeholder="Descreva o que foi feito"></textarea>
          <mat-error *ngIf="timeForm.get('description')?.hasError('required')">
            Descrição é obrigatória
          </mat-error>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancelar</button>
      <button mat-raised-button color="primary" (click)="onSave()" [disabled]="timeForm.invalid">
        Registrar
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .time-form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      min-width: 400px;
    }

    .full-width {
      width: 100%;
    }

    .form-row {
      display: flex;
      gap: 1rem;
    }

    .half-width {
      flex: 1;
    }

    mat-dialog-content {
      padding: 1rem 0;
    }
  `]
})
export class AddTimeEntryDialogComponent {
  timeForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddTimeEntryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AddTimeEntryData
  ) {
    this.timeForm = this.fb.group({
      date: [new Date(), Validators.required],
      hours: ['', [Validators.required, Validators.min(0), Validators.max(24)]],
      activity_type: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.timeForm.valid) {
      this.dialogRef.close(this.timeForm.value);
    }
  }
}

import { Component, Inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

export interface AddTagData {
  projectId: number;
}

@Component({
  selector: 'app-add-tag-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule
  ],
  template: `
    <h2 mat-dialog-title>Adicionar Tag</h2>
    <mat-dialog-content>
      <form [formGroup]="tagForm" class="tag-form">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Nome da tag</mat-label>
          <input matInput formControlName="name" placeholder="Digite o nome da tag">
          <mat-error *ngIf="tagForm.get('name')?.hasError('required')">
            Nome é obrigatório
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Cor</mat-label>
          <input matInput formControlName="color" type="color" value="#3f51b5">
          <mat-error *ngIf="tagForm.get('color')?.hasError('required')">
            Cor é obrigatória
          </mat-error>
        </mat-form-field>

        <div class="color-preview" [style.background-color]="tagForm.get('color')?.value">
          <span>{{tagForm.get('name')?.value || 'Preview'}}</span>
        </div>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancelar</button>
      <button mat-raised-button color="primary" (click)="onSave()" [disabled]="tagForm.invalid">
        Adicionar
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .tag-form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      min-width: 300px;
    }

    .full-width {
      width: 100%;
    }

    .color-preview {
      padding: 0.5rem 1rem;
      border-radius: 1rem;
      color: white;
      text-align: center;
      font-size: 0.875rem;
      margin-top: 0.5rem;
    }

    mat-dialog-content {
      padding: 1rem 0;
    }
  `]
})
export class AddTagDialogComponent {
  @Input() projectId: any = null;
  tagForm: FormGroup;
  tagName: string = '';
  selectedColor: string = '#3f51b5';

  colorOptions = [
    { name: 'Azul', value: '#3f51b5' },
    { name: 'Verde', value: '#4caf50' },
    { name: 'Vermelho', value: '#f44336' },
    { name: 'Laranja', value: '#ff9800' },
    { name: 'Roxo', value: '#9c27b0' },
    { name: 'Teal', value: '#009688' },
    { name: 'Indigo', value: '#3f51b5' },
    { name: 'Rosa', value: '#e91e63' },
    { name: 'Amarelo', value: '#ffeb3b' },
    { name: 'Cinza', value: '#607d8b' },
    { name: 'Marrom', value: '#795548' },
    { name: 'Azul Claro', value: '#03a9f4' }
  ];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddTagDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AddTagData
  ) {
    this.tagForm = this.fb.group({
      name: ['', Validators.required],
      color: ['#3f51b5', Validators.required]
    });
  }

  selectColor(color: string): void {
    this.selectedColor = color;
  }

  onCustomColorChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.selectedColor = target.value;
  }

  onSubmit(): void {
    if (this.tagName && this.tagName.trim().length > 0) {
      this.dialogRef.close({
        name: this.tagName.trim(),
        color: this.selectedColor
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.tagForm.valid) {
      this.dialogRef.close(this.tagForm.value);
    }
  }
}

import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { trigger, state, style, transition, animate } from '@angular/animations';

export interface ConfirmDeleteData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'warning' | 'danger';
  itemName?: string;
}

@Component({
  selector: 'app-confirm-delete-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="confirm-dialog" [@slideIn]>
      <div class="dialog-header" [ngClass]="data.type || 'warning'">
        <div class="icon-container">
          <mat-icon>{{ getIcon() }}</mat-icon>
        </div>
        <h2 mat-dialog-title>{{ data.title }}</h2>
      </div>

      <div mat-dialog-content class="dialog-content">
        <p class="message">{{ data.message }}</p>
        <div class="item-highlight" *ngIf="data.itemName">
          <strong>{{ data.itemName }}</strong>
        </div>
      </div>

      <div mat-dialog-actions class="dialog-actions">
        <button
          mat-button
          (click)="onCancel()"
          class="cancel-btn">
          {{ data.cancelText || 'Cancelar' }}
        </button>
        <button
          mat-raised-button
          color="warn"
          (click)="onConfirm()"
          class="confirm-btn"
          [ngClass]="data.type || 'warning'">
          <mat-icon>delete</mat-icon>
          {{ data.confirmText || 'Excluir' }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    .confirm-dialog {
      width: 100%;
      max-width: 500px;
      padding: 0;
    }

    .dialog-header {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 24px 24px 16px;
      border-bottom: 1px solid #e0e0e0;

      &.warning {
        background: linear-gradient(135deg, #fff3e0 0%, #ffecb3 100%);
        border-bottom-color: #ffb74d;
      }

      &.danger {
        background: linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%);
        border-bottom-color: #f44336;
      }

      .icon-container {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(255, 255, 255, 0.9);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

        mat-icon {
          font-size: 24px;
          width: 24px;
          height: 24px;
        }
      }

      &.warning .icon-container mat-icon {
        color: #f57c00;
      }

      &.danger .icon-container mat-icon {
        color: #d32f2f;
      }

      h2 {
        margin: 0;
        font-size: 1.5rem;
        font-weight: 600;
        color: #333;
      }
    }

    .dialog-content {
      margin: 10px;
      padding: 24px;

      .message {
        font-size: 1rem;
        line-height: 1.5;
        color: #666;
        margin: 0 0 16px;
      }

      .item-highlight {
        margin: 10px;
        background: #f5f5f5;
        padding: 12px 16px;
        border-radius: 8px;
        border-left: 4px solid #ff9800;
        font-size: 0.9rem;

        strong {
          color: #333;
          font-weight: 600;
        }
      }
    }

    .dialog-actions {
      padding: 16px 24px 24px;
      display: flex;
      gap: 12px;
      justify-content: space-around;
      border-top: 1px solid #e0e0e0;
      background: #fafafa;

      .cancel-btn {
        min-width: 100px;
        font-weight: 500;
      }

      .confirm-btn {
        min-width: 120px;
        font-weight: 600;

        &.warning {
          background: #f57c00;
          color: white;

          &:hover {
            background: #ef6c00;
          }
        }

        &.danger {
          background: #d32f2f;
          color: white;

          &:hover {
            background: #c62828;
          }
        }

        mat-icon {
          font-size: 16px;
          width: 16px;
          height: 16px;
          margin-right: 8px;
        }
      }
    }

    // Animações
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-5px); }
      75% { transform: translateX(5px); }
    }

    .confirm-btn:hover {
      animation: shake 0.3s ease-in-out;
    }
  `],
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'scale(0.8)', opacity: 0 }),
        animate('300ms cubic-bezier(0.35, 0, 0.25, 1)',
                style({ transform: 'scale(1)', opacity: 1 }))
      ])
    ])
  ]
})
export class ConfirmDeleteDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDeleteData
  ) {}

  getIcon(): string {
    switch (this.data.type) {
      case 'danger':
        return 'dangerous';
      case 'warning':
      default:
        return 'warning';
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
}

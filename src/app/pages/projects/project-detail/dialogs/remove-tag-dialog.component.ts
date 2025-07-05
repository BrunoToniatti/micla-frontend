import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  standalone: true,
  selector: 'app-remove-tag-dialog',
  imports: [
    CommonModule,
    MatIcon
  ],
  templateUrl: './remove-tag-dialog.component.html',
  styleUrls: ['./remove-tag-dialog.component.scss']
})
export class RemoveTagDialogComponent {
  @Input() tagName: string = '';
  @Input() tagColor: string = '#6c757d';
  @Input() isVisible: boolean = false;

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onConfirm() {
    this.confirm.emit();
  }

  onCancel() {
    this.cancel.emit();
  }
}

import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-tag',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './add-tag.component.html',
  styleUrl: './add-tag.component.scss'
})
export class AddTagComponent {
  @Output() closeDialog = new EventEmitter<void>();
  @Output() addTag = new EventEmitter<{name: string, color: string}>();

  tagName: string = '';
  tagColor: string = '#007bff';

  onCancel(): void {
    this.closeDialog.emit();
  }

  onAddTag(): void {
    if (this.tagName.trim()) {
      this.addTag.emit({
        name: this.tagName.trim(),
        color: this.tagColor
      });
      this.tagName = '';
      this.tagColor = '#007bff';
    }
  }

  onColorChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.tagColor = target.value;
  }
}

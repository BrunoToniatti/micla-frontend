import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProjectsComponent } from '../../../../projects.component';
import { TagTeamService } from '../tag-team.service';

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
  @Input() ProjectId: any;

  projectId: any;

  constructor(
    private dbService: TagTeamService
  ) {}

  newTag = {
    name: '',
    color: '#007bff', // Default color
    projectId: 0
  }

  onCancel(): void {
    this.closeDialog.emit();
  }

  ngOnInit(): void {
    this.projectId = this.ProjectId;
  }

  onAddTag(projectId: number): void {
    const payload = {
      name: this.newTag.name,
      color: this.newTag.color,
      projectId: projectId
    }
    this.dbService.createTag(payload).subscribe({
      next: (tag) => {
        console.log('Tag created:', tag);
      },
      error: (error) => {
        console.error('Error creating tag:', error);
      },
    })
  }

  onColorChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.newTag.color = target.value;
  }
}

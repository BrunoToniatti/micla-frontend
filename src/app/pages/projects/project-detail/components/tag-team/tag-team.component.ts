import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { trigger, transition, style, animate } from '@angular/animations';
import { Project } from '../../../../../services/projects.service';
import { AddTagComponent } from '../add-tag/add-tag.component';

@Component({
  selector: 'app-tag-team',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule,
    AddTagComponent
  ],
  templateUrl: './tag-team.component.html',
  styleUrl: './tag-team.component.scss',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class TagTeamComponent {
  @Input() project!: Project;
  @Output() projectChange = new EventEmitter<Project>();

  showAddTagDialog = false;

  constructor(private snackBar: MatSnackBar) {}

  // ===== MÉTODOS DAS TAGS =====
  onAddTag(): void {
    this.showAddTagDialog = true;
  }

  onCloseAddTagDialog(): void {
    this.showAddTagDialog = false;
  }

  onAddNewTag(tagData: {name: string, color: string}): void {
    // Simular adição de tag sem conectar ao banco
    const newTag = {
      id: this.project.tags ? Math.max(...this.project.tags.map(t => t.id)) + 1 : 1,
      name: tagData.name,
      color: tagData.color
    };

    if (this.project.tags) {
      this.project.tags.push(newTag);
    } else {
      this.project.tags = [newTag];
    }

    this.showAddTagDialog = false;
    this.projectChange.emit(this.project);
    this.showSnackBar(`Tag "${tagData.name}" adicionada com sucesso!`, 'success');
  }

  onRemoveTag(tagId: number): void {
    if (confirm('Tem certeza que deseja remover esta tag?')) {
      if (this.project.tags) {
        this.project.tags = this.project.tags.filter(tag => tag.id !== tagId);
        this.projectChange.emit(this.project);
        this.showSnackBar('Tag removida com sucesso!', 'success');
      }
    }
  }

  // ===== MÉTODOS DA EQUIPE =====
  onAddTeamMember(): void {
    // Simular adição de membro da equipe
    console.log('Adicionar membro da equipe');
    this.showSnackBar('Funcionalidade de adicionar membro em desenvolvimento!', 'success');
  }

  onRemoveTeamMember(memberId: number): void {
    if (confirm('Tem certeza que deseja remover este membro da equipe?')) {
      if (this.project.members) {
        this.project.members = this.project.members.filter(m => m.id !== memberId);
        this.projectChange.emit(this.project);
        this.showSnackBar('Membro removido da equipe com sucesso!', 'success');
      }
    }
  }

  private showSnackBar(message: string, type: 'success' | 'error'): void {
    this.snackBar.open(message, 'Fechar', {
      duration: 5000,
      panelClass: type === 'success' ? 'snack-success' : 'snack-error',
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }
}

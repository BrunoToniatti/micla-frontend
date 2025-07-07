import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { trigger, transition, style, animate } from '@angular/animations';
import { Project } from '../../../../../services/projects.service';
import { AddTagComponent } from './add-tag/add-tag.component';

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
  @Input() projectId: any;
  @Output() projectChange = new EventEmitter<Project>();

  showAddTagDialog = false;

  constructor(private snackBar: MatSnackBar) {}

  openDialogAddTag(): void {
    this.showAddTagDialog = true;
  }
}

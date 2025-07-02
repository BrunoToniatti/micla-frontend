import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'micla_frontend';
  constructor(private authService: AuthService) {
    this.authService.loadPermissionsOnStartup(); // 👈 isso garante as permissões após F5
  }
}

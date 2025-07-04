import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    HttpClientModule,
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [
    trigger('fadeSlide', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(30px)' }),
        animate('600ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('shake', [
      transition('* => shake', [
        animate('300ms', style({ transform: 'translateX(-10px)' })),
        animate('300ms', style({ transform: 'translateX(10px)' })),
        animate('300ms', style({ transform: 'translateX(0)' }))
      ])
    ])
  ]
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage = '';
  isLoading = false;
  showPassword = false;
  shakeState = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.triggerShake();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    const payload = this.loginForm.value;

    this.http.post<any>('http://localhost:8000/api/token/', payload).subscribe({
      next: (res) => {
        localStorage.setItem('access_token', res.access);
        localStorage.setItem('refresh_token', res.refresh);

        if (res.user) {
          localStorage.setItem('user', JSON.stringify(res.user));
          this.authService.loadPermissionsOnStartup();
        }

        this.router.navigate(['/painel']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'Usuário ou senha incorretos';
        this.triggerShake();
      }
    });
  }

  private triggerShake() {
    this.shakeState = 'shake';
    setTimeout(() => this.shakeState = '', 900);
  }
}

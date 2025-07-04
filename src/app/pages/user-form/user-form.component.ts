import { Component, OnInit } from '@angular/core';
import { trigger, style, animate, transition, state } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User, UsersService } from '../../services/users.service';

@Component({
  standalone: true,
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
  imports: [
    CommonModule,
    FormsModule
  ],
  animations: [
    trigger('fadeSlide', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('formState', [
      state('initial', style({ opacity: 1, transform: 'scale(1)' })),
      state('loading', style({ opacity: 0.8 })),
      state('success', style({ opacity: 0, transform: 'scale(0.95) translateY(-20px)' })),
      transition('initial => loading', animate('200ms ease')),
      transition('loading => success', animate('500ms ease')),
      transition('* => initial', animate('300ms ease'))
    ]),
    trigger('successMessage', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.8)' }),
        animate('600ms 300ms ease', style({ opacity: 1, transform: 'scale(1)' }))
      ])
    ]),
    trigger('checkmark', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0)' }),
        animate('500ms cubic-bezier(0.175, 0.885, 0.32, 1.275)', 
          style({ opacity: 1, transform: 'scale(1)' }))
      ])
    ])
  ]
})
export class UserFormComponent implements OnInit {
  user = { firstName: '', lastName: '', password: '', confirmPassword: '' };
  
  rules = {
    upper: false,
    special: false,
    number: false,
    length: false,
    match: false
  };
  
  passwordStrength = 0;
  showPassword = false;
  showConfirmPassword = false;
  formState = 'initial';
  message: string = '';
  token: string = '';
  loading = false;
  success = false;

  constructor(
    private route: ActivatedRoute,
    private userService: UsersService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
      console.log('Token recebido:', this.token);
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
  
  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  checkPassword() {
    const pwd = this.user.password;
    
    // Check individual rules
    this.rules.upper = /[A-Z]/.test(pwd);
    this.rules.special = /[!@#$%^&*(),.?":{}|<>]/.test(pwd);
    this.rules.number = /[0-9]/.test(pwd);
    this.rules.length = pwd.length >= 8;
    
    // Check if passwords match
    this.rules.match = pwd === this.user.confirmPassword && pwd !== '';
    
    // Calculate password strength
    let strength = 0;
    if (this.rules.upper) strength += 25;
    if (this.rules.special) strength += 25;
    if (this.rules.number) strength += 25;
    if (this.rules.length) strength += 25;
    
    this.passwordStrength = strength;
  }

  getPasswordStrengthClass(): string {
    if (this.passwordStrength <= 25) return 'weak';
    if (this.passwordStrength <= 75) return 'medium';
    return 'strong';
  }

  isFormValid(): boolean {
    return this.user.firstName.trim() !== '' && 
           this.user.lastName.trim() !== '' && 
           this.rules.upper && 
           this.rules.special && 
           this.rules.number && 
           this.rules.length &&
           this.rules.match;
  }

  submit() {
    if (this.isFormValid()) {
      this.loading = true;
      this.formState = 'loading';

      const payload: User = {
        first_name: this.user.firstName,
        last_name: this.user.lastName,
        password: this.user.password,
        token: this.token
      };

      this.userService.createUser(payload).subscribe({
        next: (res) => {
          this.success = true;
          this.formState = 'success';
          this.message = 'Cadastro realizado com sucesso!';
          
          setTimeout(() => {
            this.router.navigate(['/']);
          }, 3000);
        },
        error: (err) => {
          this.loading = false;
          this.formState = 'initial';
          this.message = 'Erro ao cadastrar. Por favor, tente novamente.';
        }
      });
    } else {
      this.message = 'Por favor, preencha corretamente todos os campos.';
      setTimeout(() => this.message = '', 3000);
    }
  }
}

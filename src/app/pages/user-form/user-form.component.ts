import { Component } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OnInit } from '@angular/core';
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
    ])
  ]
})
export class UserFormComponent {
  user = { firstName: '', lastName: '', password: '' };

  rules = {
    upper: false,
    special: false,
    number: false
  };

  message: string = ''

  token: string = '';

  loading = false;

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

  checkPassword() {
    const pwd = this.user.password;
    this.rules.upper = /[A-Z]/.test(pwd);
    this.rules.special = /[!@#$%^&*(),.?":{}|<>]/.test(pwd);
    this.rules.number = /[0-9]/.test(pwd);
  }

  submit() {
    if (this.rules.upper && this.rules.special && this.rules.number) {
      this.loading = true;

      const payload: User = {
        first_name: this.user.firstName,
        last_name: this.user.lastName,
        password: this.user.password,
        token: this.token
      };

      this.userService.createUser(payload).subscribe({
        next: (res) => {
          this.message = 'Cadastro com sucesso! Redirecionando...';
          setTimeout(() => {
            this.router.navigate(['/']);
          }, 3000);
        },
        error: () => {
          this.loading = false;
          alert('Erro ao cadastrar. Tente novamente.');
        }
      });
    } else {
      alert("A senha não atende aos critérios.");
    }
  }
}

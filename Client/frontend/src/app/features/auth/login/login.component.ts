import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    InputTextModule,
    ButtonModule,
    CardModule,
    MessagesModule,
    MessageModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.errorMessage = '';
    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        // Navigate to home page or dashboard after successful login
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error('Login error', error);
        this.errorMessage = 'Invalid email or password';
      }
    });
  }
}

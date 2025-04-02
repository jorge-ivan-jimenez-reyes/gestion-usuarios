import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="profile-container">
      <h2>User Profile</h2>
      <form (ngSubmit)="onSubmit()">
        <div>
          <label for="username">Username:</label>
          <input type="text" id="username" name="username" [(ngModel)]="profile.username" required>
        </div>
        <div>
          <label for="email">Email:</label>
          <input type="email" id="email" name="email" [(ngModel)]="profile.email" required>
        </div>
        <button type="submit" [disabled]="isLoading">Update Profile</button>
      </form>
      <p *ngIf="errorMessage" class="error-message">{{ errorMessage }}</p>
      <p *ngIf="successMessage" class="success-message">{{ successMessage }}</p>
    </div>
  `,
  styles: [`
    .profile-container {
      max-width: 400px;
      margin: 0 auto;
      padding: 20px;
    }
    form div {
      margin-bottom: 15px;
    }
    label {
      display: block;
      margin-bottom: 5px;
    }
    input {
      width: 100%;
      padding: 8px;
    }
    button {
      padding: 10px 15px;
      background-color: #007bff;
      color: white;
      border: none;
      cursor: pointer;
    }
    button:disabled {
      background-color: #cccccc;
    }
    .error-message {
      color: red;
    }
    .success-message {
      color: green;
    }
  `]
})
export class ProfileComponent implements OnInit {
  profile = {
    username: '',
    email: ''
  };
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    // TODO: Fetch current user profile
    // This would typically involve a GET request to your backend
    // For now, we'll just use placeholder data
    this.profile = {
      username: 'Current Username',
      email: 'current@email.com'
    };
  }

  onSubmit() {
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.updateProfile(this.profile).subscribe({
      next: (updatedProfile) => {
        this.successMessage = 'Profile updated successfully';
        this.profile = updatedProfile;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Profile update error', error);
        this.errorMessage = 'Failed to update profile. Please try again.';
        this.isLoading = false;
      }
    });
  }
}

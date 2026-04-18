import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {
  private apiService = inject(ApiService);
  private router = inject(Router);

  email = '';
  password = '';
  loading = false;
  errorMessage = '';
  successMessage = '';

  submitLogin(): void {
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.apiService.login(this.email, this.password).subscribe({
      next: (response) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('username', this.email);
        this.successMessage = 'Login successful. You can now apply to universities.';
        this.loading = false;
        this.router.navigate(['/universities']);
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Login failed. Please check your KBTU email and password.';
      },
    });
  }
}

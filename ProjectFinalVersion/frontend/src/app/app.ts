import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet, Router } from '@angular/router';
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  constructor(
    private router: Router,
    private apiService: ApiService
  ) {}

  get isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  get username(): string {
    return localStorage.getItem('username') || 'student';
  }

  logout(): void {
    this.apiService.logout().subscribe({
      next: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('email');
        this.router.navigate(['/login']);
      },
      error: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('email');
        this.router.navigate(['/login']);
      }
    });
  }
}
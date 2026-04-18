import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { ApplicationItem } from '../../models/university.model';

@Component({
  selector: 'app-applications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './applications.html',
  styleUrl: './applications.css'
})
export class ApplicationsComponent implements OnInit {
  private apiService = inject(ApiService);
  private cdr = inject(ChangeDetectorRef);

  applications: ApplicationItem[] = [];
  errorMessage = '';
  isLoading = false;

  ngOnInit(): void {
    this.loadApplications();
  }

  loadApplications(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    this.apiService.getApplications().subscribe({
      next: (data) => {
        this.applications = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage =
          err.error?.detail ||
          JSON.stringify(err.error) ||
          'Could not load applications.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  cancelApplication(applicationId: number): void {
    this.apiService.deleteApplication(applicationId).subscribe({
      next: () => {
        this.applications = this.applications.filter(app => app.id !== applicationId);
      },
      error: () => {
        this.errorMessage = 'Could not cancel application.';
      }
    });
  }
}
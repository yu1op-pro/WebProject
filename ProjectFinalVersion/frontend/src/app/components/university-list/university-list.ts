import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { University } from '../../models/university.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-university-list',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './university-list.html',
  styleUrl: './university-list.css',
})
export class UniversityListComponent implements OnInit {
  private apiService = inject(ApiService);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);

  universities: University[] = [];
  filteredUniversities: University[] = [];
  errorMessage = '';
  successMessage = '';
  isLoading = false;

  gpa: number | null = 3.5;
  ielts: number | null = 6.5;
  countryFilter = '';
  facultyFilter = '';
  searchTerm = '';
  stats = { total_universities: 0, total_countries: 0 };

  applyingId: number | null = null;
  appliedUniversityIds: number[] = [];
  lastAppliedId: number | null = null;

  ngOnInit(): void {
    this.fetchStats();
    this.fetchUniversities();

    // 👇 ВОТ СЮДА ДОБАВЛЯЕМ
    this.apiService.getApplications().subscribe({
      next: (apps) => {
        this.appliedUniversityIds = apps.map(a => a.university);
      },
      error: () => {
        console.log('Not logged in or no applications');
      }
    });
  }

  fetchStats(): void {
    console.log('fetchStats started');

    this.apiService.getUniversityStats().subscribe({
      next: (data) => {
        console.log('STATS DATA:', data);
        this.stats = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log('STATS ERROR:', err);
        this.stats = { total_universities: 0, total_countries: 0 };
        this.cdr.detectChanges();
      },
    });
  }

  fetchUniversities(): void {
    console.log('fetchUniversities started');

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.cdr.detectChanges();

    this.apiService.getUniversities(this.gpa, this.ielts).subscribe({
      next: (data) => {
        console.log('UNIVERSITIES DATA:', data);
        this.universities = data;
        this.applyLocalFilters();
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log('UNIVERSITIES ERROR:', err);
        this.errorMessage = 'Could not load universities. Make sure the Django server is running.';
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  applyLocalFilters(): void {
    const search = this.searchTerm.trim().toLowerCase();
    const country = this.countryFilter.trim().toLowerCase();
    const faculty = this.facultyFilter.trim().toLowerCase();

    this.filteredUniversities = this.universities.filter((uni) => {
      const facultyNames = (uni.faculties || []).map((item) => item.name.toLowerCase());

      const matchesSearch =
        !search ||
        uni.name.toLowerCase().includes(search) ||
        uni.country.toLowerCase().includes(search) ||
        facultyNames.some((name) => name.includes(search));

      const matchesCountry = !country || uni.country.toLowerCase().includes(country);
      const matchesFaculty = !faculty || facultyNames.some((name) => name.includes(faculty));

      return matchesSearch && matchesCountry && matchesFaculty;
    });

    this.cdr.detectChanges();
  }

  applyToUniversity(universityId: number): void {
    this.applyingId = universityId;
    this.cdr.detectChanges(); // 👈 ВАЖНО

    this.apiService.createApplication(universityId).subscribe({
      next: () => {
        this.lastAppliedId = universityId;
        this.successMessage = 'Application submitted successfully!';

        if (!this.appliedUniversityIds.includes(universityId)) {
          this.appliedUniversityIds.push(universityId);
        }

        this.applyingId = null;
        this.cdr.detectChanges(); // 👈 ВАЖНО
      },
      error: (err) => {
        this.applyingId = null;
        this.cdr.detectChanges(); // 👈 ВАЖНО

        if (err.status === 401) {
          alert('Please log in first');
          this.router.navigate(['/login']);
        } else if (err.status === 400) {
          alert('You already applied to this university');

          if (!this.appliedUniversityIds.includes(universityId)) {
            this.appliedUniversityIds.push(universityId);
          }
        } else {
          alert('Error submitting application');
        }
      }
    });
  }
  

  clearFilters(): void {
    // очищаем ВСЕ поля
    this.gpa = null;
    this.ielts = null;
    this.countryFilter = '';
    this.facultyFilter = '';
    this.searchTerm = '';

    // заново загружаем ВСЕ университеты
    this.fetchUniversities();
  }

  getChanceValue(chance: string | null | undefined): number {
    if (!chance) {
      return 0;
    }
    return Number(chance.replace('%', '')) || 0;
  }

  getStatusLabel(chance: string | null | undefined): string {
    const value = this.getChanceValue(chance);

    if (value >= 85) return 'Strong match';
    if (value >= 60) return 'Possible';
    return 'Reach';
  }

  getFacultyNames(uni: University): string {
    if (!uni.faculties?.length) {
      return 'Faculty information is not available';
    }

    return uni.faculties.map((faculty) => faculty.name).join(', ');
  }
}
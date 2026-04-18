import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApplicationItem, LoginResponse, University } from '../models/university.model';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private readonly baseUrl = 'http://127.0.0.1:8000/api';

  getUniversities(gpa?: number | null, ielts?: number | null): Observable<University[]> {
    let params = new HttpParams();

    if (gpa !== null && gpa !== undefined) {
      params = params.set('gpa', gpa.toString());
    }

    if (ielts !== null && ielts !== undefined) {
      params = params.set('ielts', ielts.toString());
    }

    return this.http.get<University[]>(`${this.baseUrl}/universities/`, { params });
  }

  getUniversityStats(): Observable<{ total_universities: number; total_countries: number }> {
    return this.http.get<{ total_universities: number; total_countries: number }>(`${this.baseUrl}/stats/`);
  }

  getApplications(): Observable<ApplicationItem[]> {
    return this.http.get<ApplicationItem[]>(`${this.baseUrl}/applications/`);
  }

  createApplication(universityId: number): Observable<ApplicationItem> {
    return this.http.post<ApplicationItem>(`${this.baseUrl}/applications/`, {
      university: universityId
    });
  }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/login/`, { email, password });
  }

  deleteApplication(applicationId: number): Observable<void> {
  return this.http.delete<void>(`${this.baseUrl}/applications/${applicationId}/`);
  }

  logout() {
  return this.http.post(`${this.baseUrl}/logout/`, {});
  }
}

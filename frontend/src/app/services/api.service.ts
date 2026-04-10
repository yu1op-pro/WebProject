import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { University } from '../models/university.model';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) {}

  // Получение вузов с расчетом шансов
  getUniversities(gpa?: number, ielts?: number): Observable<University[]> {
    let params = new HttpParams();
    if (gpa) params = params.append('gpa', gpa);
    if (ielts) params = params.append('ielts', ielts);
    
    return this.http.get<University[]>(`${this.baseUrl}/universities/`, { params });
  }

  // Подача заявки (нужен токен)
  createApplication(universityId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/applications/`, { university: universityId });
  }
}
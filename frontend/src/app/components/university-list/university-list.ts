import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-university-list',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './university-list.html', 
  styleUrl: './university-list.css'
})
export class UniversityListComponent implements OnInit {
  universities: any[] = [];
  errorMessage: string = ''; // Добавили для Пункта 9

  // Эти переменные должны совпадать и в классе, и в методе, и в HTML
  myGpa: number = 3.69; 
  myIelts: number = 7.5;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.fetchUniversities();
  }
  
  // Метод для расчета шансов (нужен для твоего красивого дизайна)
  calculateChance(uni: any): number {
    if (this.myGpa >= uni.min_gpa) return 100;
    const diff = uni.min_gpa - this.myGpa;
    if (diff > 0.5) return 30;
    return Math.round(100 - (diff * 100));
  }

  apply(universityId: number) {
    this.apiService.createApplication(universityId).subscribe({
      next: (res) => alert('Заявка успешно создана!'),
      error: (err) => alert('Ошибка! Возможно, вы не авторизованы.')
    });
  }

  fetchUniversities() {
    // Используем именно this.myGpa и this.myIelts
    this.apiService.getUniversities(this.myGpa, this.myIelts).subscribe({
      next: (data) => {
        this.universities = data;
        this.errorMessage = '';
      },
      error: (err) => {
        this.errorMessage = 'Не удалось загрузить данные. Проверьте соединение с бэкендом.';
        console.error(err);
      }
    });
  }
}
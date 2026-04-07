import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { University } from '../../models/university.model';
import { FormsModule } from '@angular/forms'; // Важно для ngModel
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-university-list',
  standalone: true,
  imports: [FormsModule, CommonModule],
  // БЫЛО: templateURL: './university-list.component.html'
  // СТАЛО:
  templateUrl: './university-list.html', 
  styleUrl: './university-list.css'
})
export class UniversityListComponent implements OnInit {
  universities: University[] = [];
  // Пункт 3: начальные значения для [(ngModel)]
  userGpa: string = '3.69'; 
  userIelts: string = '7.5';
  errorMessage: string = '';

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.fetchUniversities();
  }
  
  apply(universityId: number) {
  this.apiService.createApplication(universityId).subscribe({
    next: (res) => alert('Заявка успешно создана!'),
    error: (err) => alert('Ошибка! Возможно, вы не авторизованы.')
  });
}

  // Пункт 2: метод, который сработает по клику
  fetchUniversities() {
    this.apiService.getUniversities(this.userGpa, this.userIelts).subscribe({
      next: (data) => {
        this.universities = data;
        this.errorMessage = '';
      },
      error: (err) => {
        // Пункт 9: Обработка ошибок
        this.errorMessage = 'Не удалось загрузить данные. Проверьте соединение с бэкендом.';
        console.error(err);
      }
    });
  }
}
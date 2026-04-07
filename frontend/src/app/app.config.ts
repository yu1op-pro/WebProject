import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http'; // Обнови импорт
import { routes } from './app.routes';
import { authInterceptor } from './services/auth.interceptor'; // Импорт интерцептора

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])) // Подключаем тут
  ]
};
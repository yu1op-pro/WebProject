import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Берем токен из памяти браузера (куда мы его сохраним при логине)
  const token = localStorage.getItem('token');

  // Если токен есть, клонируем запрос и добавляем заголовок Authorization
  if (token) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Token ${token}` // Формат как в твоем Postman!
      }
    });
    return next(authReq);
  }

  return next(req);
};
import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { catchError, switchMap, throwError } from 'rxjs';

export const tokenInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) => {
  const authService = inject(AuthService);
  const http = inject(HttpClient);

  const accessToken = authService.getToken();

  const authReq = accessToken
    ? req.clone({ setHeaders: { Authorization: `Bearer ${accessToken}` } })
    : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        const refreshToken = authService.getRefreshToken();

        if (refreshToken) {
          // tenta renovar o token
          return http.post<any>('http://localhost:8000/api/token/refresh/', {
            refresh: refreshToken,
          }).pipe(
            switchMap((res) => {
              authService.setToken(res.access);
              const retryReq = req.clone({
                setHeaders: { Authorization: `Bearer ${res.access}` }
              });
              return next(retryReq);
            }),
            catchError(err => {
              authService.logout();
              return throwError(() => err);
            })
          );
        }

        authService.logout();
      }

      return throwError(() => error);
    })
  );
};

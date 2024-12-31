import { HttpClient, HttpErrorResponse, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { environnement } from '../../environnement/environnement';
import { inject } from '@angular/core';
import { StorageService } from '../service/storage.service';
import { catchError, switchMap, Observable, throwError, BehaviorSubject, filter, take } from 'rxjs';
import { LoginResponse } from '../classes/interfaces';

const END_POINT = environnement.api_url;

// Subject pour éviter les appels multiples de refresh token
let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const storage = inject(StorageService);
  const http = inject(HttpClient);

  // Ignorer les requêtes d'authentification
  if (req.url.includes('/auth/login') || req.url.includes('/auth/refresh')) {
    return next(req);
  }

  const accessToken = storage.getAccessToken();
  
  if (accessToken) {
    const clonedReq = addTokenToRequest(req, accessToken);
    
    return next(clonedReq).pipe(
      catchError((error) => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          return handleUnauthorizedError(req, next, http, storage);
        }
        return throwError(() => error);
      })
    );
  }

  return next(req);
};

// Correction du typage pour HttpRequest au lieu de Request
function addTokenToRequest(request: HttpRequest<any>, token: string): HttpRequest<any> {
  return request.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });
}

function handleUnauthorizedError(
  request: HttpRequest<any>, 
  next: any, 
  http: HttpClient, 
  storage: StorageService
): Observable<any> {
  if (isRefreshing) {
    return refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap(token => {
        if (!token) {
          return throwError(() => new Error('No token available'));
        }
        return next(addTokenToRequest(request, token));
      })
    );
  }

  isRefreshing = true;
  refreshTokenSubject.next(null);

  return refreshToken(http, storage).pipe(
    switchMap((newToken: string) => {
      isRefreshing = false;
      refreshTokenSubject.next(newToken);
      
      return next(addTokenToRequest(request, newToken));
    }),
    catchError((error) => {
      isRefreshing = false;
      refreshTokenSubject.next(null);
      storage.logout();
      window.location.href = '/login';
      return throwError(() => error);
    })
  );
}

function refreshToken(http: HttpClient, storage: StorageService): Observable<string> {
  const refreshToken = storage.getRefreshToken();
  
  if (!refreshToken) {
    return throwError(() => new Error('No refresh token available'));
  }

  return http.post<LoginResponse>(`${END_POINT}/auth/refresh`, { 
    token: refreshToken 
  }).pipe(
    switchMap((response: LoginResponse) => {
      storage.saveToken(response);
      return new Observable<string>(observer => {
        observer.next(response.token);
        observer.complete();
      });
    }),
    catchError((error) => {
      console.error('Error refreshing token:', error);
      return throwError(() => new Error('Failed to refresh token'));
    })
  );
}
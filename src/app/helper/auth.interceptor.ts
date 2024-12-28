import { HttpClient, HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { environnement } from '../../environnement/environnement';
import { inject } from '@angular/core';
import { StorageService } from '../service/storage.service';
import { catchError, map, Observable, switchMap, throwError, of } from 'rxjs';
import { LoginResponse } from '../classes/interfaces';

const END_POINT = environnement.api_url;
let isRefreshingToken = false;

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const storage = inject(StorageService);
  const http = inject(HttpClient);

  // Ne pas intercepter les requêtes d'authentification
  if (req.url.includes('/auth/login') || req.url.includes('/auth/refresh')) {
    return next(req);
  }

  const accessToken = storage.getAccessToken();

  if (!accessToken) {
    // Si pas de token, rediriger vers login
    storage.logout();
    window.location.href = '/login';
    return next(req);
  }

  // Cloner la requête avec le token
  const clonedReq = req.clone({
    headers: req.headers.set('Authorization', `Bearer ${accessToken}`)
  });

  return next(clonedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Si erreur 401 et pas déjà en train de rafraîchir
      if (error.status === 401 && !isRefreshingToken) {
        isRefreshingToken = true;
        
        return refreshToken(http, storage).pipe(
          switchMap((success: boolean) => {
            isRefreshingToken = false;
            
            if (success) {
              // Récupérer le nouveau token
              const newToken = storage.getAccessToken();
              // Réessayer la requête avec le nouveau token
              const updatedReq = req.clone({
                headers: req.headers.set('Authorization', `Bearer ${newToken}`)
              });
              return next(updatedReq);
            } else {
              // En cas d'échec du refresh
              storage.logout();
              window.location.href = '/login';
              return throwError(() => new Error('Session expirée'));
            }
          }),
          catchError((refreshError) => {
            isRefreshingToken = false;
            storage.logout();
            window.location.href = '/login';
            return throwError(() => refreshError);
          })
        );
      }
      
      // Pour les autres erreurs
      return throwError(() => error);
    })
  );
};

function refreshToken(http: HttpClient, storage: StorageService): Observable<boolean> {
  const refreshToken = storage.getRefreshToken();
  
  if (!refreshToken) {
    return of(false);
  }

  return http.post<LoginResponse>(
    `${END_POINT}/auth/refresh`,
    { token: refreshToken }
  ).pipe(
    map((response: LoginResponse) => {
      if (response && response.token) {
        storage.saveToken(response);
        return true;
      }
      return false;
    }),
    catchError(() => {
      return of(false);
    })
  );
}
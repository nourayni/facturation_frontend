import { Injectable } from '@angular/core';
import { LoginResponse } from '../classes/interfaces';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private readonly TOKEN_KEY = 'tokens';
  private readonly USER_KEY = 'user';

  constructor() { }

  // Méthodes de gestion des tokens
  saveToken(loginResponse: LoginResponse): void {
    try {
      localStorage.setItem(this.TOKEN_KEY, JSON.stringify(loginResponse));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du token:', error);
    }
  }

  getToken(): LoginResponse | null {
    try {
      const token = localStorage.getItem(this.TOKEN_KEY);
      return token ? JSON.parse(token) : null;
    } catch (error) {
      console.error('Erreur lors de la récupération du token:', error);
      return null;
    }
  }

  removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

  getAccessToken(): string {
    const token = this.getToken();
    return token?.token ?? '';
  }

  getRefreshToken(): string {
    const token = this.getToken();
    return token?.refreshToken ?? '';
  }

  // Méthodes de gestion de l'utilisateur
  // saveUser(user: User): void {
  //   try {
  //     localStorage.setItem(this.USER_KEY, JSON.stringify(user));

  //   } catch (error) {
  //     console.error('Erreur lors de la sauvegarde de l\'utilisateur:', error);
  //   }
  // }

  // getUser(): User | null {
  //   try {
  //     const user = localStorage.getItem(this.USER_KEY);
  //     return user ? JSON.parse(user) : null;
  //   } catch (error) {
  //     console.error('Erreur lors de la récupération de l\'utilisateur:', error);
  //     return null;
  //   }
  // }

  // removeUser(): void {
  //   localStorage.removeItem(this.USER_KEY);
  // }

  // // Méthodes de vérification des rôles
  // private hasRole(roleName: RoleType): boolean {
  //   const user = this.getUser();
  //   return user?.roles?.some(role => role.roleName === roleName) ?? false;
  // }

  // isAdmin(): boolean {
  //   return this.hasRole(RoleType.ADMIN);
  // }

  // isUser(): boolean {
  //   return this.hasRole(RoleType.USER);
  // }

  // isLoggedIn(): boolean {
  //   return this.isAuthenticated() && this.getUser() !== null;
  // }

  // // Méthode de déconnexion
  logout(): void {
    this.removeToken();
    //this.removeUser();
  }

}

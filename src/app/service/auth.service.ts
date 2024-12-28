import { Injectable } from '@angular/core';
import { environnement } from '../../environnement/environnement';
import { HttpClient } from '@angular/common/http';
import { LoginRequest, LoginResponse, UserRequest, UserResponse } from '../classes/interfaces';
import { Observable } from 'rxjs';


const end_point = environnement.api_url;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http:HttpClient) { }

  login(loginRequest: LoginRequest): Observable<LoginResponse>{
    return this.http.post<LoginResponse>(`${end_point}/auth/login`, loginRequest);
  }

  register(UserRequest: UserRequest): Observable<UserResponse>{
    return this.http.post<UserResponse>(`${end_point}/auth/register`, UserRequest);
  }
}

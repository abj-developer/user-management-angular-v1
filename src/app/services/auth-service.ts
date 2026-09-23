import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { LoginRequest, LoginResponse } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly baseUrl = 'https://abjms.duckdns.org/auth';

  constructor(private http: HttpClient) {}

  isAuthenticated(): boolean {
    return !!localStorage.getItem('accessToken');
  }

  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  login(username: string, password: string): Observable<LoginResponse> {

    const request: LoginRequest = {
      username,
      password
    };

    return this.http
      .post<LoginResponse>(
        `${this.baseUrl}/auth/login`,
        request
      )
      .pipe(
        tap(response => {
          localStorage.setItem(
            'accessToken',
            response.accessToken
          );
        })
      );
  }
}
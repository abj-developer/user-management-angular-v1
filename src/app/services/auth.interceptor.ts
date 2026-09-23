import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from './auth-service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ) {
    const isLoginRequest = req.url.includes('/auth/auth/login');
    const request = this.addToken(req);

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && !isLoginRequest) {
          this.authService.logout();
          this.router.navigate(['/login'], { replaceUrl: true });
        }

        return throwError(() => error);
      })
    );
  }

  private addToken(req: HttpRequest<any>): HttpRequest<any> {
    const token = localStorage.getItem('accessToken');

    if (!token) {
      return req;
    }

    return req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
}

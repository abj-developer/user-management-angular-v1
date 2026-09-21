import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler
} from '@angular/common/http';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ) {
      if (req.url.includes('/auth/auth/login')) {
    return next.handle(req);
      }

    const token = localStorage.getItem('accessToken');

    if (token) {
      const authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });

      return next.handle(authReq);
    }

    return next.handle(req);
  }
}
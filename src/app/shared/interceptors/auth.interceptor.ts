import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse
} from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import swal from 'sweetalert2';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(public authService: AuthService,
              private router: Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log(`AuthInterceptor: Procesando el request '${req.url}'.`);
    if (this.authService.token != null) {

    }
    return next.handle(req).pipe(
      catchError( e => {
        if (e.status == 0) {
          swal.fire('Error en el servidor', `No hay respuesta para el request '${req.url}'.`, 'error');
        }
        else if (e.status == 401) {
          if (this.authService.isAuthenticated()) {
            this.authService.logout();
          }
          this.router.navigate(['/login']);
        } else if (e.status == 403) {
          swal.fire('Acceso denegado', `No tienes acceso a este recurso.`, 'warning');
          this.router.navigate(['/colaboradores']);
        }
        return throwError(e);
      })
    );
  }
}

import { Injectable, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { LoginService } from './services/login.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  #loginService = inject(LoginService)
  #router = inject(Router)

  constructor() {}

  canActivate(): Observable<boolean> {
    return this.#loginService.checkLogin(this.#loginService.getToken()).pipe(
      map(response => true),
      catchError((error) => {
        this.#router.navigate(['/login']);
        return of(false);
      })
    );
  }
}

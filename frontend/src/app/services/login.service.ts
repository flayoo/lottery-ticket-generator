import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Login } from '../models/login.model';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  #http = inject(HttpClient)

  private apiBaseUrl = environment.apiBaseUrl;

  constructor() { }

  login(email: string, password: string): Observable<any> {
    const url = `${this.apiBaseUrl}/login`;
    const credentials = { email, password };
    return this.#http.post(url, credentials);
  }

  register(email: string, password: string): Observable<any> {
    const Url = `${this.apiBaseUrl}/register`;
    const credentials = { email, password };
    return this.#http.post(Url, credentials);
  }

  checkLogin(token: string): Observable<any> {
    const url = `${this.apiBaseUrl}/check-login`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    };
    return this.#http.get(url, httpOptions);
  }

  validateForm(loginData : Login) {
    const  emailInvalid = !(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginData.email));
    const  passwordInvalid = !(loginData.password.length >= 5);
    return { emailInvalid, passwordInvalid }
  }

  setToken(token: any) {
    localStorage.setItem('token', token);
  }

  getToken() {
    const token = localStorage.getItem('token');
    return (token) ? token : '';
  }

  logout() {
    localStorage.removeItem('token');
  }

}

import { Component, inject } from '@angular/core';
import { Login } from '../../models/login.model';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  #loginService = inject(LoginService);
  #router = inject(Router);

  // ----------------------------------------------------------------

  loginError = false;
  emailInvalid = false;
  passwordInvalid = false;
  errorMessage = ""

  loginData: Login = {
    email: '',
    password: ''
  };

  constructor() { }

  onSubmit(event: Event): void {
    event.preventDefault();

    this.loginError = false;
    this.emailInvalid = false;
    this.passwordInvalid = false;
    this.errorMessage = "";

    const validationForm = this.#loginService.validateForm(this.loginData);

    this.emailInvalid = validationForm.emailInvalid
    this.passwordInvalid = validationForm.passwordInvalid

    if (!this.emailInvalid && !this.passwordInvalid) {

      this.#loginService.login(this.loginData.email, this.loginData.password).subscribe({
        next: (response) => {
          this.#loginService.setToken(response.token);
          this.#router.navigate(['/']);
        },
        error: (error) => {
          this.errorMessage = (error.error && error.error.message) ? error.error.message : "Unknown error";
          this.loginError = true;
        }
      });

    }
  }

}

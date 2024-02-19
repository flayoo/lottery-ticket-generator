import { Component } from '@angular/core';
import { Login } from '../../models/login.model';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

  registerError = false;
  emailInvalid = false;
  passwordInvalid = false;
  errorMessage = "";

  loginData: Login = {
    email: '',
    password: ''
  };

  constructor(private loginService: LoginService) { }

  onSubmit(event: Event): void {
    event.preventDefault();

    this.registerError = false;
    this.emailInvalid = false;
    this.passwordInvalid = false;
    this.errorMessage = "";

    const validationForm = this.loginService.validateForm(this.loginData);

    this.emailInvalid = validationForm.emailInvalid
    this.passwordInvalid = validationForm.passwordInvalid

    if (!this.emailInvalid && !this.passwordInvalid) {

      this.loginService.register(this.loginData.email, this.loginData.password).subscribe({
        next: (response) => {
          console.log('Login erfolgreich', response);
        },
        error: (error) => {
          this.errorMessage = (error.error && error.error.message) ? error.error.message : "Unbekannter Fehler";
          this.registerError = true;
        }
      });

    }
  }
}

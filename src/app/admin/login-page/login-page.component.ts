import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent implements OnInit, OnDestroy {
  submited: boolean = false;
  firebaseError: string = '';
  aSub?: Subscription;

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
  });
  get email() {
    return this.loginForm.get('email');
  }
  get password() {
    return this.loginForm.get('password');
  }

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
  
  }

  ngOnDestroy() {
    if (this.aSub) {
      this.aSub.unsubscribe();
    }
  }
  resetError(error:string){
    this.firebaseError = error
  }
  send() {
    if (this.loginForm.invalid) {
      return;
    }
    this.submited = true;

    const user = {
      email: this.email?.value,
      password: this.password?.value,
      returnSecureToken: true,
    };

    this.aSub = this.authService.login(user).subscribe(
      (res) => {
        this.loginForm.reset;
        this.router.navigate(['admin/dashboard']);
        this.submited = false;
      },
      (error) => {
        const errorMessage = error.error.error.message;
        console.log(errorMessage);
        switch (errorMessage) {
          case 'TOO_MANY_ATTEMPTS_TRY_LATER : Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later.':
            this.firebaseError =
              'Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later. ';
            break;
          case 'INVALID_PASSWORD':
            this.firebaseError = 'Invalid Password, please enter the correct password';
            break;
            case 'EMAIL_NOT_FOUND':
              this.firebaseError = 'Email is not found, please enter the correct email';
              break;
          default:
            this.firebaseError = '';
        }
        this.submited = false;
      }
    );
  }
}

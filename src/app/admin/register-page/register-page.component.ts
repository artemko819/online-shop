import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss'],
})
export class RegisterPageComponent implements OnInit, OnDestroy {
  firebaseError: string = '';
  submited: boolean = false;
  aSub?: Subscription;

  registerForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
  });

  get email() {
    return this.registerForm.get('email');
  }
  get password() {
    return this.registerForm.get('password');
  }

  constructor(private auhService: AuthService, private router:Router) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    if (this.aSub) {
      this.aSub.unsubscribe();
    }
  }

  resetError(error: string) {
    this.firebaseError = error;
  }

  send() {
    const user = {
      email: this.email?.value,
      password: this.password?.value,
      returnSecureToken: true,
    };
    this.aSub = this.auhService.register(user).subscribe(
      (res) => {
        this.registerForm.reset;
        this.router.navigate(['admin/login']);
        this.submited = false;
      },
      (error) => {
        const errorMessage = error.error.error.message;
        console.log(errorMessage);
        switch (errorMessage) {
          case 'EMAIL_EXISTS':
            this.firebaseError =
              'The email address is already in use by another account.';
            break;
          case 'OPERATION_NOT_ALLOWED':
            this.firebaseError =
              'Password sign-in is disabled for this project.';
            break;
          case 'TOO_MANY_ATTEMPTS_TRY_LATER':
            this.firebaseError =
              'We have blocked all requests from this device due to unusual activity. Try again later.';
            break;
          default:
            this.firebaseError = '';
        }
        this.submited = false;
      }
    );
  }
}

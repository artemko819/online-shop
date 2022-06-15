import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {
  submited: boolean = false;
  firebaseError: string = '';
  aSub?: Subscription;

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  get email() {
    return this.form.get('email');
  }

  constructor(private authService: AuthService, private router: Router) {}

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
    if (this.form.invalid) {
      return;
    }
    this.submited = true;

    const user = {
      email: this.email?.value,
      requestType: 'PASSWORD_RESET',
    };

    this.aSub = this.authService.resetPassword(user).subscribe(
      (res) => {
        this.form.reset;
        this.router.navigate(['admin/login']);
        this.submited = false;
      },
      (error) => {
        const errorMessage = error.error.error.message;
        console.log(errorMessage);
        if (errorMessage === 'INVALID_EMAIL') {
          this.firebaseError =
            'Email is not valid, please enter the correct email';
        }
        if (errorMessage === 'EMAIL_NOT_FOUND') {
          this.firebaseError =
            'Email is not found, please enter the correct email';
        }
        this.submited = false;
      }
    );
  }
}

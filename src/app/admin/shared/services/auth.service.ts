import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}
  login(User: Object) {
    return this.http
      .post(
        `${environment.baseUrl}signInWithPassword?key=${environment.firebaseConfig.apiKey}`,
        User
      )
      .pipe(tap(this.setToken));
  }

  resetPassword(userEmail: Object) {
    return this.http.post(
      `${environment.baseUrl}sendOobCode?key=${environment.firebaseConfig.apiKey}`,
      userEmail
    );
  }

  register(User: Object) {
    return this.http.post(
      `${environment.baseUrl}signUp?key=${environment.firebaseConfig.apiKey}`,
      User
    );
  }

  private setToken(response: any) {
    if (response) {
      const expData = new Date(
        new Date().getTime() + +response.expiresIn * 1000
      );
      localStorage.setItem('fb-token-exp', expData.toString()); //time life token
      localStorage.setItem('fb-token', response.idToken); //token
    } else {
      localStorage.clear();
    }
  }
  get token(){
    const tokenLife = new Date(`${localStorage.getItem('fb-token-exp')}`)
    const timeNow = new Date()
    if(timeNow.getTime() > tokenLife.getTime()){
      this.logout()
      return null;
    }
   return localStorage.getItem('fb-token')
  }
  
  logout(){
    this.setToken(null)
  }
  
  isAuthenticated():boolean{
    //переобразовуем в булеан и
    // возвращаем значение если есть тру если нул то фалсе
    return !!this.token
  }
}

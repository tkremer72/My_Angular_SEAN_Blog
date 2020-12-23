import { AuthData } from '../models/auth-data.model';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';




const BACKEND = environment.authsApi;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private isAuthenticated = false;
  private tokenTimer: any;

  private authStatusListener = new Subject<boolean>();

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  getIsAuth() {
    return this.isAuthenticated;
  }
  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  registerUser(user_email: string, user_password: string) {
    const authData: AuthData = {
      user_email: user_email,
      user_password: user_password
    }
    this.http.post(BACKEND + 'signup', authData)
    .subscribe(() => {
      this.router.navigate(['/users-login']);
    }, error => {
      this.authStatusListener.next(false);
    });
  }

  loginUser(user_email: string, user_password: string) {
    const authData: AuthData = {
      user_email: user_email,
      user_password: user_password
    }
    this.http.post<{
      token: string,
      expiresIn: number,
      userId: string
    }>(
      BACKEND + 'login',
      authData
      ).subscribe(response => {
        console.log(response);
        const expiresInDuration = response.expiresIn;
       localStorage.setItem('token', response.token);
       localStorage.setItem('userId', response.userId);
       this.router.navigate(['/'])
      });
  }

  logoutUser() {
    
  }

}

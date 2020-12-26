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
  private token: string;
  private tokenTimer: any;
  private userId: string;
  private is_admin: any;

  private authStatusListener = new Subject<boolean>();
  private adminStatusListener = new Subject<boolean>();

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  getToken() {
    return this.token
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

   getIsAdmin() {
    return this.is_admin;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  getAdminStatusListener() {
    return this.adminStatusListener.asObservable();
  }

  getUserId() {
    return this.userId;
  }


  registerUser(user_email: string, user_password: string) {
    const authData: AuthData = {
      user_email: user_email,
      user_password: user_password
    }
    this.http.post(
      BACKEND + 'signup',
      authData
    ).subscribe(() => {
      this.router.navigate(['/users-login']);
    }, error => {
      this.authStatusListener.next(false);
      this.adminStatusListener.next(false);
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
      userId: string,
      is_admin: any,
    }>(
      BACKEND + 'login',
      authData
    ).subscribe(response => {
      //   console.log(response);
      //   const expiresInDuration = response.expiresIn;
      //  localStorage.setItem('token', response.token);
      //  localStorage.setItem('userId', response.userId);
      //  this.router.navigate(['/'])
      const token = response.token;
      this.token = token;
      if (token) {
        const expiresInDuration = response.expiresIn;
        this.setAuthTimer(expiresInDuration);
        this.isAuthenticated = true;
        this.userId = response.userId;
        this.is_admin = response.is_admin;
        this.authStatusListener.next(true);
        this.adminStatusListener.next(true);
        const now = new Date();
        const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
        this.saveAuthData(token, expirationDate, this.userId, this.is_admin)
        this.router.navigate(['/users-profile'])
      }
    }, error => {
      this.authStatusListener.next(false);
      this.adminStatusListener.next(false);
    });
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    // console.log(authInformation, expiresIn)
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.userId = authInformation.userId;
      this.is_admin = authInformation.is_admin;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
      this.adminStatusListener.next(true);
    }
  }

  logoutUser() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.adminStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.userId = null;
    this.is_admin = false;
    this.clearAuthData();
    this.router.navigate(['/users-login']);
  }

  private setAuthTimer(duration: number) {
    console.log("Setting timer: " + duration);
    this.tokenTimer = setTimeout(() => {
      this.logoutUser();
    }, duration * 1000)
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string, is_admin: any) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
    localStorage.setItem('is_admin', is_admin)
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
    localStorage.removeItem('is_admin');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    const is_admin = localStorage.getItem('is_admin');
    if (!token || !expirationDate) {
      return null;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId,
      is_admin: is_admin
    }
  }
}

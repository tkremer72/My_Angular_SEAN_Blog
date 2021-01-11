import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { User } from '../../shared/models/user.model';

const BACKEND = environment.adminApi;

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private users: User[] = [];
  public user: User;
  private usersUpdated = new Subject<{ users: User[], userCount: number }>();

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  getUserUpdateListener() {
    return this.usersUpdated.asObservable();
  }

  getUser(userId: string) {
    return this.http.get<{
      id: string,
      first_name: string,
      last_name: string,
      user_name: string,
      user_email: string,
      user_address: string,
      user_city: string,
      user_state: string,
      user_zip: string,
      user_phone: string,
      user_mobile: string,
      imagePath: string
    }>(BACKEND + userId).subscribe((user: any) => {
      this.user = user;
    });
  }

  getUsers() {
    /* let token = localStorage.getItem('token');
    let header = new HttpHeaders().set('key', token); */
    return this.http.get<{ message: string, users: any, maxUsers: number }>(
      BACKEND + 'users' /* , { headers: header } */).pipe(map((userData) => {
        return {
          users: userData.users.map((user: {
            first_name: string;
            last_name: string;
            user_name: string;
            user_email: string;
            user_address: string;
            user_city: string;
            user_state: string;
            user_zip: string;
            user_phone: string;
            user_mobile: string;
            imagePath: string;
          }) => {
            return {
              first_name: user.first_name,
              last_name: user.last_name,
              user_name: user.user_name,
              user_email: user.user_email,
              user_address: user.user_address,
              user_city: user.user_city,
              user_state: user.user_state,
              user_zip: user.user_zip,
              user_phone: user.user_phone,
              user_mobile: user.user_mobile,
              imagePath: user.imagePath
            };
          }), maxUsers: userData.maxUsers
        }
      })
      ).subscribe(transformedUsersData => {
        this.users = transformedUsersData.users;
        this.usersUpdated.next({
          users: [...this.users],
          userCount: transformedUsersData.maxUsers
        });
      })
  }

  deleteUser(userId: string) {
    /* let token = localStorage.getItem('token');
    let header = new HttpHeaders().set('key', token); */
    return this.http.delete(BACKEND + userId/* , { headers: header } */);
  }
}

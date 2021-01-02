import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { User } from '../../shared/models/user.model';

const BACKEND = environment.usersApi;

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private users: User[] = [];
  private usersUpdated = new Subject<{ users: User[], userCount: number }>();

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  getUserUpdateListener() {
    return this.usersUpdated.asObservable();
  }
  getProfile(userId: number) {
    /* let token = localStorage.getItem('token');
    let header = new HttpHeaders().set('key', token); */
    return this.http.get(BACKEND + 'profile'/* , { headers: header } */)
  }
  
getUser(id: string) {
  /* let token = localStorage.getItem('token');
  let header = new HttpHeaders().set('key', token) ;*/
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
  }>(BACKEND + id/* , {headers: header} */)
}

updateUser(
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
  image: File | string
) {
 /*  let token = localStorage.getItem('token');
  let header = new HttpHeaders().set('key', token); */
  let userData: User | FormData;
  if(typeof(image) === 'object') {
    userData = new FormData();
  userData.append('id', id),
  userData.append('first_name', first_name);
  userData.append('last_name', last_name);
  userData.append('user_name', user_name);
  userData.append('user_email', user_email);
  userData.append('user_address', user_address);
  userData.append('user_city', user_city);
  userData.append('user_state', user_state);
  userData.append('user_zip', user_zip);
  userData.append('user_phone', user_phone);
  userData.append('user_mobile', user_mobile);
  userData.append('image', image, user_name);
  } else {
    userData = {
      id: id,
      first_name: first_name,
      last_name: last_name,
      user_name: user_name,
      user_email: user_email,
      user_address: user_address,
      user_city: user_city,
      user_state: user_state,
      user_zip: user_zip,
      user_phone: user_phone,
      user_mobile: user_mobile,
      imagePath: image
    }
  }
  this.http.put(BACKEND + id, userData/* , {headers: header} */)
  .subscribe(responseData => {
    this.router.navigate(['/users-profile']);
  })
}


// getUsers() {
//   /* let token = localStorage.getItem('token');
//   let header = new HttpHeaders().set('key', token); */
//   return this.http.get<{ message: string, users: any, maxUsers: number}>(
//     BACKEND/* , { headers: header } */).pipe(map((userData) => {
//       return {
//         users: userData.users.map((user: {
//           first_name: string;
//           last_name: string;
//           user_name: string;
//           user_email: string;
//           user_address: string;
//           user_city: string;
//           user_state: string;
//           user_zip: string;
//           user_phone: string;
//           user_mobile: string;
//           imagePath: string; }) => {
//           return {
//            first_name: user.first_name,
//            last_name: user.last_name,
//            user_name: user.user_name,
//            user_email: user.user_email,
//            user_address: user.user_address,
//            user_city: user.user_city,
//            user_state: user.user_state,
//            user_zip: user.user_zip,
//            user_phone: user.user_phone,
//            user_mobile: user.user_mobile,
//            imagePath: user.imagePath
//           };
//         }), maxUsers: userData.maxUsers
//       }
//     })
//     ) .subscribe(transformedUsersData => {
//       this.users = transformedUsersData.users;
//       this.usersUpdated.next({
//         users: [...this.users],
//         userCount: transformedUsersData.maxUsers
//       });
//     })
// }
// deleteUser(userId: string) {
//   /* let token = localStorage.getItem('token');
//   let header = new HttpHeaders().set('key', token); */
//   return this.http.delete(
//     BACKEND + userId/* , { headers: header} */
//     ).subscribe(() => {
//       this.router.navigate(['admin-users-list'])
//     })
// }
}

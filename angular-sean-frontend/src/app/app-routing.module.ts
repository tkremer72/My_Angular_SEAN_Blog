import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserLoginComponent } from './components/auth/user-login/user-login.component';
import { UserSignupComponent } from './components/auth/user-signup/user-signup.component';
import { UserProfileComponent } from './components/users/user-profile/user-profile.component';

const routes: Routes = [
  { path: 'users-registration', component: UserSignupComponent },
  { path: 'users-login', component: UserLoginComponent },
  { path: 'users-profile', component: UserProfileComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

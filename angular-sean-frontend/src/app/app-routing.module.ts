import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserLoginComponent } from './components/auth/user-login/user-login.component';
import { UserSignupComponent } from './components/auth/user-signup/user-signup.component';
import { BlogCreateComponent } from './components/blogs/blog-create/blog-create.component';
import { BlogDetailsComponent } from './components/blogs/blog-details/blog-details.component';
import { BlogListComponent } from './components/blogs/blog-list/blog-list.component';
import { ListUsersComponent } from './components/users/list-users/list-users.component';
import { UpdateUserComponent } from './components/users/update-user/update-user.component';
import { UserProfileComponent } from './components/users/user-profile/user-profile.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'users-registration', component: UserSignupComponent },
  { path: 'users-login', component: UserLoginComponent },
  { path: 'users-profile', component: UserProfileComponent },
  { path: 'admin-users-list', component: ListUsersComponent },
  { path: 'users-update/:userId', component: UpdateUserComponent },
  { path: 'users-new-blog', component: BlogCreateComponent},
  { path: 'users-blogs-list', component: BlogListComponent },
  { path: 'users-blogs-details/:blogId', component: BlogDetailsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

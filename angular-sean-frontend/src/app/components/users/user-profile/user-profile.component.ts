import { AuthService } from '../../../shared/services/auth.service';
import { BlogService } from '../../../shared/services/blog.service';
import { Blog } from '../../../shared/models/blog.model';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserService } from '../../../shared/services/user.service';
import { User } from '../../../shared/models/user.model';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit, OnDestroy {

  public isLoading = false;
  public isAuthenticated = false;
  public is_admin = false;
  public user: User;
  public blogs: Blog[] = [];
  public userIsAuthenticated = false;

  private authStatusSubs: Subscription;
  private adminStatusSubs: Subscription;

  constructor(
    private authService: AuthService,
    private blogService: BlogService,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.isLoading = true;
    this.getProfile();
    this.getBlogs();
    this.is_admin = this.authService.getIsAdmin();
    this.adminStatusSubs = this.authService.getAdminStatusListener()
    .subscribe(isAdmin => {
      this.is_admin = isAdmin;
    });
    this.isAuthenticated = this.authService.getIsAuth();
    this.authStatusSubs = this.authService.getAuthStatusListener()
    .subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
    });
    this.isLoading = false;
  }
  getProfile() {
    const userId = +this.route.snapshot.paramMap.get('id');
    this.userService.getProfile(userId).subscribe((user: any) => {
      this.user = user;
      //console.log(user);
    });
  }
  getBlogs() {

  }
ngOnDestroy() {
  this.authStatusSubs.unsubscribe();
  this.adminStatusSubs.unsubscribe();
}
}

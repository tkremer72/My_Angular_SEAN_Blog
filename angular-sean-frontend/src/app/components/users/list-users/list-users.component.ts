import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from '../../../shared/models/user.model';
import { AuthService } from '../../../shared/services/auth.service';
import { UserService } from '../../../shared/services/user.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.css']
})
export class ListUsersComponent implements OnInit, OnDestroy {

  users: User[] = []
  isLoading = false;
 
  totalUsers = 0;

  usersPerPage = 2;

  pageSizeOptions = [1, 2, 5, 10];

  currentPage = 1;

  userIsAuthenticated = false;
  userId: string;

  private usersSubs: Subscription;
  private authStatusSubs: Subscription;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private sanatizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.userService.getUsers();
    this.userId = this.authService.getUserId();
    this.usersSubs = this.userService.getUserUpdateListener()
    .subscribe((userData: { users: User[], userCount: number }) => {
      this.isLoading = false;
      this.totalUsers = userData.userCount;
      this.users = userData.users;
    })
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSubs = this.authService.getAuthStatusListener()
    .subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
      this.userId = this.authService.getUserId();
    });
  }
  onPageChange(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.usersPerPage = pageData.pageSize;
    this.userService.getUsers();
  }
onDelete(userId: string) {
  this.isLoading = true;
  this.userService.deleteUser(userId).subscribe(() => {
    this.userService.getUsers();
  })
}
sanatizeImageUrl(imagePath: string): SafeUrl {
  return this.sanatizer.bypassSecurityTrustUrl(imagePath);
}
  ngOnDestroy() {

  }
}

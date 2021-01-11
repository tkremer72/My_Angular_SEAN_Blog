import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from 'src/app/shared/services/admin.service';
import { AuthService } from '../../../shared/services/auth.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { PageEvent } from '@angular/material/paginator';
import { User } from '../../../shared/models/user.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.css']
})
export class ListUsersComponent implements OnInit, OnDestroy {

  public users: User[] = []

  public user: User;
  public isLoading = false;

  public totalUsers = 0;
  public usersPerPage = 2;
  public pageSizeOptions = [1, 2, 5, 10];
  public currentPage = 1;

  public isAuthenticated = false;
  public userIsAuthenticated = false;
  public isAdmin = false;
  public userIsAdmin = false;
  public userId: string;

  private usersSubs: Subscription;
  private authStatusSubs: Subscription;

  constructor(
    private authService: AuthService,
    private adminService: AdminService,
    private route: ActivatedRoute,
    private router: Router,
    private sanatizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.isLoading = true;
    this.adminService.getUsers();
    //this.adminService.getUser(this.userId);
    this.userId = this.authService.getUserId();
    this.usersSubs = this.adminService.getUserUpdateListener()
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
 /*  onPageChange(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.usersPerPage = pageData.pageSize;
    this.adminService.getUsers();
  } */
  onDelete(userId: string) {
    this.isLoading = true;
    this.users = this.users.filter(blog => blog.id !== blog.id);
    this.adminService.deleteUser(userId).subscribe(result => {
    });
  }
  sanatizeImageUrl(imagePath: string): SafeUrl {
    return this.sanatizer.bypassSecurityTrustUrl(imagePath);
  }

  ngOnDestroy() {
    this.authStatusSubs.unsubscribe();
    this.usersSubs.unsubscribe();
  }
}

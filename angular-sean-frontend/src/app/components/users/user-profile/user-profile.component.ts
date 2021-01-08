import { AuthService } from '../../../shared/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogService } from '../../../shared/services/blog.service';
import { Blog } from '../../../shared/models/blog.model';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserService } from '../../../shared/services/user.service';
import { User } from '../../../shared/models/user.model';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit, OnDestroy {

  public blogsPerPage = 2;
  public currentPage = 0;

  public isLoading = false;
  public user: User;
  public userId: string;
  public user_id: string;
  public blogs: Blog[] = [];
  public blogId: string;
  public userIsAuthenticated = false;

  private authStatusSubs: Subscription;
  private blogSubs: Subscription;

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
    this.blogSubs = this.blogService.getBlogUpdateListener()
    .subscribe((blogData: { blogs: Blog[] }) => {
      this.blogs = blogData.blogs;
    })
    this.userId = this.authService.getUserId();
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSubs = this.authService.getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
    this.isLoading = false;
  }

  getProfile() {
    const userId = +this.route.snapshot.paramMap.get('id');
    this.userService.getProfile(userId).subscribe((user: any) => {
      this.user = user;
      this.blogService.getUsersBlogs().subscribe((blogData: any) => {
        this.blogs = blogData;
        //console.log(blogData[0].author);
      });
    });
  }

  onDelete(blogId: string) {
    this.isLoading = true;
    this.blogs = this.blogs.filter(blog => blog.id !== blog.id);
    this.blogService.deleteBlog(blogId).subscribe(result => {
    });
  }
  
  ngOnDestroy() {
    this.authStatusSubs.unsubscribe();
    this.blogSubs.unsubscribe();
  }
}

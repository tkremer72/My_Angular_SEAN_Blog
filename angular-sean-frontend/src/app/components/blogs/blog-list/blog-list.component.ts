import { AuthService } from '../../../shared/services/auth.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { BlogService } from '../../../shared/services/blog.service';
import { Blog } from '../../../shared/models/blog.model';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-blog-list',
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.css']
})
export class BlogListComponent implements OnInit, OnDestroy {

   blogs: Blog[] = [];
   isLoading = false;
   totalBlogs = 0;
   blogsPerPage = 2;
   pageSizeOptions = [1, 2, 5, 10];
   currentPage = 1;

   userIsAuthenticated = false;
   userId: string;

  private blogSubs: Subscription;
  private authStatusSubs: Subscription;


  constructor(
    private authService: AuthService,
    private blogService: BlogService
  ) { }

  ngOnInit() {
    this.isLoading = true;
    this.blogService.getBlogs(this.blogsPerPage, this.currentPage);
    this.userId = this.authService.getUserId();
    this.blogSubs = this.blogService.getBlogUpdateListener()
    .subscribe((blogData: { blogs: Blog[], blogCount: number}) => {
      this.isLoading = false;
      this.totalBlogs = blogData.blogCount;
      this.blogs = blogData.blogs;
    });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSubs = this.authService.getAuthStatusListener()
    .subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
      this.userId = this.authService.getUserId();
    })
  }
  onChangedPage(pageData: PageEvent) {
    console.log(pageData);
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.blogsPerPage = pageData.pageSize;
    this.blogService.getBlogs(this.blogsPerPage, this.currentPage);
  }
  onDelete(blogId: string) {
    this.isLoading = true;
    this.blogService.deleteBlog(blogId).subscribe(() => {
      this.blogService.getBlogs(this.blogsPerPage, this.currentPage)
    })
  }
  ngOnDestroy() {
    this.authStatusSubs.unsubscribe();
    this.blogSubs.unsubscribe();
  }
}

import { AuthService } from '../../../shared/services/auth.service';
import { Blog } from '../../../shared/models/blog.model';
import { BlogService } from '../../../shared/services/blog.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-blog-details',
  templateUrl: './blog-details.component.html',
  styleUrls: ['./blog-details.component.css']
})
export class BlogDetailsComponent implements OnInit, OnDestroy {

  public blog: Blog;
  public isLoading = false;
  public userIsAuthenticated = false;
  public userId: string;
  public blogId: string;

  private authStatusSubs: Subscription;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private blogService: BlogService
  ) { }

  ngOnInit() {
    this.authStatusSubs = this.authService.getAuthStatusListener()
    .subscribe(authStatus => {
      this.isLoading = false;
    });
    this.userId = this.authService.getUserId();
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if(paramMap.has('blogId')) {
        this.blogId = paramMap.get('blogId');
        this.isLoading = true;
        this.blogService.getBlog(this.blogId).subscribe(blogData => {
          this.blog = {
            id: blogData.id,
            title: blogData.title,
            description: blogData.description,
            date: blogData.date,
            author: blogData.author,
            creator: blogData.user_id
          }
        })
      } else {
        return;
      }
    })
  }

  ngOnDestroy() {

  }
}

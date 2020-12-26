import { Blog } from '../models/blog.model';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

const BACKEND = environment.blogsApi;

@Injectable({
  providedIn: 'root'
})
export class BlogService {

  private blogs: Blog[] = [];
  private blogsUpdated = new Subject<{ blogs: Blog[], blogCount: number }>();

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  getBlogUpdateListener() {
    return this.blogsUpdated.asObservable();
  }

  getBlogs(blogsPerPage: number, currentPage: number) {
    /* let token = localStorage.getItem('token');
    let header = new HttpHeaders().set('key', token); */
    const queryParams = `?pagesize=${blogsPerPage}&page=${currentPage}`;
    this.http.get<{ message: string, blogs: any, maxBlogs: number}>(
      BACKEND + 'all/blogs/' + queryParams/* ,
      { headers: header } */
    ).pipe(map((blogData) => {
      return {
        blogs: blogData.blogs.map((blog: {
          id: any;
          title: any;
          description: any;
          date: any;
          author: any;
          user_id: any;
          is_deleted: any;
        }) => {
          return {
            id: blog.id,
            title: blog.title,
            description: blog.description,
            date: blog.date,
            author: blog.author,
            userId: blog.user_id,
            is_deleted: blog.is_deleted
          }
        }), maxBlogs: blogData.maxBlogs
      }
    })
    ).subscribe(transformedBlogsData => {
      this.blogs = transformedBlogsData.blogs;
      this.blogsUpdated.next({
        blogs: [...this.blogs],
        blogCount: transformedBlogsData.maxBlogs
      });
    });
  }

  getBlog(id: string) {
    return this.http.get<{
      id: string,
      title: string,
      description: string,
      date: string,
      author: string,
      user_id: string,
      is_deleted: boolean
    }>(BACKEND + id)
  }

  addBlog(title: string, description: string, date: string, author: string) {
  
  }
updateBlog(id: string, title: string, description: string, date: string, author: string) {


}
  deleteBlog(blogId: string) {
    /* let token = localStorage.getItem('token');
    let header = new HttpHeaders().set('key', token); */
    return this.http.delete(BACKEND + blogId/* , { headers: header } */);
  }
}

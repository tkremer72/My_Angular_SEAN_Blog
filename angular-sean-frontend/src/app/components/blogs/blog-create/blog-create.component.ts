import { AuthService } from '../../../shared/services/auth.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Blog } from '../../../shared/models/blog.model';
import { BlogService } from '../../../shared/services/blog.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-blog-create',
  templateUrl: './blog-create.component.html',
  styleUrls: ['./blog-create.component.css']
})
export class BlogCreateComponent implements OnInit, OnDestroy {

   blog: Blog;
   enteredTitle = '';
   enteredDescription = '';
   enteredDate = Date.now();
   enteredAuthor = '';
   isLoading = false;
   form: FormGroup;
   
  private mode = 'create';
  private blogId: string;

  private authStatusSubs: Subscription;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private blogService: BlogService
  ) { }

  ngOnInit() {
    this.authStatusSubs = this.authService.getAuthStatusListener()
    .subscribe(authStatus => {
      this.isLoading = false;
    });
    this.form = new FormGroup({
        'title': new FormControl(null, {
          validators: [Validators.required, Validators.minLength(4)]
        }),
        'description': new FormControl(null, {
          validators: [Validators.required]
        }),
        'date': new FormControl(null, {
          validators: [Validators.required]
        }),
        'author': new FormControl(null, {
          validators: [Validators.required, Validators.minLength(6)]
        })
    });
     this.route.paramMap.subscribe((paramMap: ParamMap) => {
       if(paramMap.has('blogId')) {
         this.mode = 'edit';
         this.blogId = paramMap.get('blogId');
         this.isLoading = true;
         this.blogService.getBlog(this.blogId).subscribe(blogData => {
           console.log(blogData);
           this.isLoading = false;
           this.blog = {
             id: blogData.id,
             title: blogData.title,
             description: blogData.description,
             date: blogData.date,
             author: blogData.author
           };
           this.form.setValue({
             'title': this.blog.title,
             'description': this.blog.description,
             'date': this.blog.date,
             'author': this.blog.date
           })
         });
       } else {
         this.mode = 'create';
         this.blogId = null;
       }
     })
  }
  onSaveBlog() {
    if(this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if(this.mode === 'create') {
      this.blogService.addBlog(
        this.form.value.title,
        this.form.value.description,
        this.form.value.date,
        this.form.value.author
      );
    } else {
      this.blogService.updateBlog(
        this.blogId,
        this.form.value.title,
        this.form.value.description,
        this.form.value.date,
        this.form.value.author
      )
    }
    this.form.reset();
  }
  ngOnDestroy() {
    this.authStatusSubs.unsubscribe();
  }
}

import { AuthService } from '../../../shared/services/auth.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent implements OnInit, OnDestroy {

  isLoading = false;
  private authStatusSubs: Subscription;


  constructor(
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authStatusSubs = this.authService.getAuthStatusListener()
      .subscribe(authStatus => {
        this.isLoading = false;
      })
  }
  onLogin(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.loginUser(form.value.user_email, form.value.user_password);
  }
  ngOnDestroy() {
    this.authStatusSubs.unsubscribe();
  }
}

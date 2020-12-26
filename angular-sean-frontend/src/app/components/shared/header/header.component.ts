import { AuthService } from '../../../shared/services/auth.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  public isAdmin = false;
  public userIsAdmin = false;
  public userIsAuthenticated = false;

  private authListenerSubs: Subscription;
  private adminListenerSubs: Subscription;



  constructor(
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.userIsAdmin = this.authService.getIsAdmin();
    this.adminListenerSubs = this.authService.getAdminStatusListener()
    .subscribe(userIsAdmin => {
      this.isAdmin = userIsAdmin;
    });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService.getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });
  }
  onLogoutUser() {
    this.authService.logoutUser();
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
    this.adminListenerSubs.unsubscribe();
  }
}

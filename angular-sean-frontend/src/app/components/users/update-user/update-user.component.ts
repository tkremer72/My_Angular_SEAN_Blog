import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../../shared/services/auth.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { mimeType } from '../../../shared/models/mime-type.validator';
import { Subscription } from 'rxjs';
import { User } from '../../../shared/models/user.model';
import { UserService } from '../../../shared/services/user.service';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.css']
})
export class UpdateUserComponent implements OnInit, OnDestroy {

  user: User;
  imagePreview: string;
  isLoading = false;
  form: FormGroup;
  private mode = 'update'
  private userId!: string;

  private authStatusSubs: Subscription;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private userService: UserService
  ) { }

  ngOnInit() {
    //this.getUser();
    this.authStatusSubs = this.authService.getAuthStatusListener()
      .subscribe(authStatus => {
        this.isLoading = false;
      });
    this.form = new FormGroup({
      'image': new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      }),
      'first_name': new FormControl(null, {
        validators: [Validators.required ]
      }),
      'last_name': new FormControl({
        validators: [Validators.required ]
      }),
      'user_name': new FormControl({
        validators: [Validators.required ]
      }),
      'user_email': new FormControl({
        validators: [Validators.required ]
      }),
      'user_address': new FormControl({
        validators: [Validators.required ]
      }),
      'user_city': new FormControl({
        validators: [Validators.required ]
      }),
      'user_state': new FormControl({
        validators: [Validators.required ]
      }),
      'user_zip': new FormControl({
        validators: [Validators.required ]
      }),
      'user_phone': new FormControl({
        validators: [Validators.required ]
      }),
      'user_mobile': new FormControl({
        validators: [Validators.required ]
      })
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('userId')) {
        this.mode = 'update'
        this.userId = paramMap.get('userId');
        this.isLoading = true;
        this.userService.getUser(this.userId).subscribe(userData => {
          //console.log(userData)
          this.isLoading = false;
          this.user = {
            id: userData.id,
            imagePath: userData.imagePath,
            first_name: userData.first_name,
            last_name: userData.last_name,
            user_name: userData.user_name,
            user_email: userData.user_email,
            user_address: userData.user_address,
            user_city: userData.user_city,
            user_state: userData.user_state,
            user_zip: userData.user_zip,
            user_phone: userData.user_phone,
            user_mobile: userData.user_mobile,
          };
          this.form.setValue({
            'image': this.user.imagePath,
            'first_name': this.user.first_name,
            'last_name': this.user.last_name,
            'user_name': this.user.user_name,
            'user_email': this.user.user_email,
            'user_address': this.user.user_address,
            'user_city': this.user.user_city,
            'user_state': this.user.user_state,
            'user_zip': this.user.user_zip,
            'user_phone': this.user.user_phone,
            'user_mobile': this.user.user_mobile,
          });
        });
      } else {
        return;
      }
    });
  }
  // getUser() {
  //   const userId = +this.route.snapshot.paramMap.get('id');
  //   this.userService.getUser(this.userId).subscribe((user: any) => {
  //     this.user = user;
  //   })
  //}
  onPickedImage(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
  onSaveUser() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    this.userService.updateUser(
      this.userId,
      this.form.value.first_name,
      this.form.value.last_name,
      this.form.value.user_name,
      this.form.value.user_email,
      this.form.value.user_address,
      this.form.value.user_city,
      this.form.value.user_state,
      this.form.value.user_zip,
      this.form.value.user_phone,
      this.form.value.user_mobile,
      this.form.value.image
    )
    this.form.reset();
  }
  ngOnDestroy() {
    this.authStatusSubs.unsubscribe();
  }
}

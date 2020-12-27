import { Component, OnDestroy, OnInit } from "@angular/core";
import { AuthService } from "../../../shared/services/auth.service";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { mimeType } from "../../../shared/models/mime-type.validator";
import { Subscription } from "rxjs";
import { User } from "../../../shared/models/user.model";
import { UserService } from "../../../shared/services/user.service";

interface State {
  value: string;
  viewValue: string;
}
@Component({
  selector: "app-update-user",
  templateUrl: "./update-user.component.html",
  styleUrls: ["./update-user.component.css"]
})
export class UpdateUserComponent implements OnInit, OnDestroy {

  user: User;
  imagePreview: string;
  isLoading = false;
  form: FormGroup;
  private mode = "update"
  private userId!: string;

  private authStatusSubs: Subscription;
  states: State[] = [
    { value: "AL", viewValue: "Alabama" },
    { value: "AK", viewValue: "Alaska" },
    { value: "AZ", viewValue: "Arizona" },
    { value: "AR", viewValue: "Arkansas" },
    { value: "CA", viewValue:  "California"},
    { value: "CO", viewValue: "Colorodo" },
    { value: "CT", viewValue: "Connecticut" },
    { value: "DE", viewValue: "Deleware" },
    { value: "FL", viewValue: "Florida" },
    { value: "GA", viewValue: "Georgia" },
    { value: "HI", viewValue: "Hawaii" },
    { value: "ID", viewValue: "Idaho" },
    { value: "IL", viewValue: "Illinoise" },
    { value: "IN", viewValue: "Indiana" },
    { value: "IA", viewValue: "Iowa" },
    { value: "KS", viewValue: "Kansas" },
    { value: "KY", viewValue: "Kentucky" },
    { value: "LA", viewValue: "Louisiana" },
    { value: "ME", viewValue: "Maine" },
    { value: "MD", viewValue: "Maryland" },
    { value: "MA", viewValue: "Massacheusettes" },
    { value: "MI", viewValue: "Michigan" },
    { value: "MN", viewValue: "Minnisota" },
    { value: "MS", viewValue: "Mississippi" },
    { value: "MO", viewValue: "Missouri" },
    { value: "MT", viewValue: "Montana" },
    { value: "NE", viewValue: "Nebraska" },
    { value: "NV", viewValue: "Nevada" },
    { value: "NH", viewValue: "New Hampshire" },
    { value: "NJ", viewValue: "New Jersey" },
    { value: "NM", viewValue: "New Mexico" },
    { value: "NY", viewValue: "New York" },
    { value: "NC", viewValue: "North Carolina" },
    { value: "ND", viewValue: "North Dakota" },
    { value: "OH", viewValue: "Ohio" },
    { value: "OK", viewValue: "Oklahoma" },
    { value: "OR", viewValue: "Oregon" },
    { value: "PA", viewValue: "Pennsylvania" },
    { value: "RI", viewValue: "Rhode Island" },
    { value: "SC", viewValue: "South Carolina" },
    { value: "SD", viewValue: "South Dakota" },
    { value: "TN", viewValue: "Tennessee" },
    { value: "TX", viewValue: "Texas" },
    { value: "UT", viewValue: "Utah" },
    { value: "VT", viewValue: "Vermont" },
    { value: "VA", viewValue: "Virginia" },
    { value: "WA", viewValue: "Washington" },
    { value: "WV", viewValue: "West Virginia" },
    { value: "WI", viewValue: "Wisconsin" },
    { value: "WY", viewValue: "Wyoming" }
  ];
selectedState = this.states[2].value;
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
      "image": new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      }),
      "first_name": new FormControl(null, {
        validators: [Validators.required ]
      }),
      "last_name": new FormControl({
        validators: [Validators.required ]
      }),
      "user_name": new FormControl({
        validators: [Validators.required ]
      }),
      "user_email": new FormControl({
        validators: [Validators.required ]
      }),
      "user_address": new FormControl({
        validators: [Validators.required ]
      }),
      "user_city": new FormControl({
        validators: [Validators.required ]
      }),
      "user_state": new FormControl({
        validators: [Validators.required ]
      }),
      "user_zip": new FormControl({
        validators: [Validators.required ]
      }),
      "user_phone": new FormControl({
        validators: [Validators.required ]
      }),
      "user_mobile": new FormControl({
        validators: [Validators.required ]
      })
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("userId")) {
        this.mode = "update"
        this.userId = paramMap.get("userId");
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
            "image": this.user.imagePath,
            "first_name": this.user.first_name,
            "last_name": this.user.last_name,
            "user_name": this.user.user_name,
            "user_email": this.user.user_email,
            "user_address": this.user.user_address,
            "user_city": this.user.user_city,
            "user_state": this.user.user_state,
            "user_zip": this.user.user_zip,
            "user_phone": this.user.user_phone,
            "user_mobile": this.user.user_mobile,
          });
        });
      } else {
        return;
      }
    });
  }
  // getUser() {
  //   const userId = +this.route.snapshot.paramMap.get("id");
  //   this.userService.getUser(this.userId).subscribe((user: any) => {
  //     this.user = user;
  //   })
  //}
  onPickedImage(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    this.form.get("image").updateValueAndValidity();
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

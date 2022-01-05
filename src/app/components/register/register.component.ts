import { Component, OnInit } from '@angular/core';
import {FormControl, Validators} from "@angular/forms";
import {customErrorStateMatcher} from "../../utils/formHandler";
import {UserService} from "../../services/user.service";
import {RegistrationRequest} from "../../models/http/RegistrationRequest";
import {Router} from "@angular/router";
import {SimpleStringRequest} from "../../models/http/SimpleStringRequest";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Constants} from "../../utils/constants";
import {TwoFactorsService} from "../../services/two-factors.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['../login/login.component.css', './register.component.css']
})
export class RegisterComponent implements OnInit {
  // Form - Email
  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  emailAvailable: boolean = false;
  emailError: boolean = false;
  // Form - Username
  usernameFormControl = new FormControl('', [Validators.required]);
  usernameAvailable: boolean = false;
  usernameError: boolean = false;
  // Form - Password
  passwordFormControl = new FormControl('', [Validators.required]);
  // Form - 2FA enabled
  twoFactorsFormControl = new FormControl(false);

  matcher = new customErrorStateMatcher();
  loading: boolean = false;

  constructor(private userService: UserService,
              private twoFactorService: TwoFactorsService,
              private router: Router,
              private snackBar: MatSnackBar) {}

  ngOnInit(): void {
  }

  checkEmail() {
    if(!this.emailFormControl.valid) {
      return;
    }
    const email: SimpleStringRequest = {
      data: this.emailFormControl.value
    };
    this.userService.checkEmailAvailable(email).subscribe(response => {
      if (response.status === Constants.STATUS_SUCCESS) {
        this.emailAvailable = true;
        this.emailError = false;
      } else {
        this.emailAvailable = false;
        this.emailError = true;
        this.snackBar.open(response.message, "Dismiss", {duration:2000});
      }
    });
  }

  checkUsername() {
    if(!this.usernameFormControl.valid) {
      return;
    }
    const username: SimpleStringRequest = {
      data: this.usernameFormControl.value
    };
    this.userService.checkUsernameAvailable(username).subscribe(response => {
      if (response.status === Constants.STATUS_SUCCESS) {
        this.usernameAvailable = true;
        this.usernameError = false;
      } else {
        this.usernameAvailable = false;
        this.usernameError = true;
        this.snackBar.open(response.message, "Dismiss", {duration:2000});
      }
    });
  }

  signIn() {
    // Build request
    const userDetails: RegistrationRequest = {
      email: this.emailFormControl.value,
      username: this.usernameFormControl.value,
      password: this.passwordFormControl.value,
      twoFactorEnabled: this.twoFactorsFormControl.value
    };
    this.loading = true;
    // Send request
    this.userService.register(userDetails).subscribe(response => {
      if(response.status === Constants.STATUS_SUCCESS) {
        // Handle success registration
        if (userDetails.twoFactorEnabled) {
          this.handleTwoFactorEnabled(response.data);
        }
        this.snackBar.open(response.message, 'Dismiss', {duration: 2000});
        this.loading = false;
        this.router.navigate(['/confirm-registration']);
      } else {
        // Handle fail/error registration
        this.snackBar.open(response.message, 'Dismiss', {duration: 2000});
        this.loading = false;
      }
    });
  }

  private handleTwoFactorEnabled(data: object[] | null) {
    if (data != null && data.length > 0) {
      this.twoFactorService.twoFactorsEnabled = true;
      this.twoFactorService.barCode = data[0].toString();
    }
  }
}

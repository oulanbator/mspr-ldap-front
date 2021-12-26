import { Component, OnInit } from '@angular/core';
import {FormControl, Validators} from "@angular/forms";
import {customErrorStateMatcher} from "../../utils/formHandler";
import {UserService} from "../../services/user.service";
import {RegistrationRequest} from "../../models/http/RegistrationRequest";
import {Router} from "@angular/router";
import {SimpleStringRequest} from "../../models/http/SimpleStringRequest";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css', '../login/login.component.css']
})
export class RegisterComponent implements OnInit {
  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  emailAvailable: boolean = false;
  emailError: boolean = false;

  usernameFormControl = new FormControl('', [Validators.required]);
  usernameAvailable: boolean = false;
  usernameError: boolean = false;

  passwordFormControl = new FormControl('', [Validators.required]);

  matcher = new customErrorStateMatcher();
  error: boolean = false;
  errorMessage: string = "";

  constructor(private userService: UserService,
              private router: Router,
              private snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }

  checkEmail() {
    if(!this.emailFormControl.valid) {
      return;
    }
    const email: SimpleStringRequest = {
      data: this.emailFormControl.value
    };
    this.userService.checkEmailAvailable(email).subscribe(data => {
      if (data.success) {
        this.emailAvailable = true;
        this.emailError = false;
      } else {
        this.emailAvailable = false;
        this.emailError = true;
        this.snackBar.open(data.message, "Dismiss", {duration:2000});
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
    this.userService.checkUsernameAvailable(username).subscribe(data => {
      if (data.success) {
        this.usernameAvailable = true;
        this.usernameError = false;
      } else {
        this.usernameAvailable = false;
        this.usernameError = true;
        this.snackBar.open(data.message, "Dismiss", {duration:2000});
      }
    });
  }

  signIn() {
    const userDetails: RegistrationRequest = {
      email: this.emailFormControl.value,
      username: this.usernameFormControl.value,
      password: this.passwordFormControl.value,
    };
    this.userService.register(userDetails).subscribe(data => {
      if(data.success) {
        this.router.navigate(['/login']);
        this.snackBar.open(data.message, 'Dismiss', {duration: 2000});
      } else {
        this.error = true;
        this.errorMessage = data.message;
      }
    });
  }

}

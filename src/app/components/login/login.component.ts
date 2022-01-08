import {AfterViewInit, Component, OnInit} from '@angular/core';
import {FormControl, Validators} from "@angular/forms";
import {customErrorStateMatcher} from "../../utils/formHandler";
import {UserService} from "../../services/user.service";
import {Router} from "@angular/router";
import {Constants} from "../../utils/constants";
import {MatSnackBar} from "@angular/material/snack-bar";
import {AuthenticationRequest} from "../../models/http/AuthenticationRequest";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  usernameFormControl = new FormControl('', [Validators.required]);
  passwordFormControl = new FormControl('', [Validators.required]);
  totpFormControl = new FormControl('', [Validators.required]);

  enterTotp: boolean = false;
  matcher = new customErrorStateMatcher();

  constructor(private userService: UserService,
              private router: Router,
              private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
  }

  login() {
    const credentials: AuthenticationRequest = {
      username: this.usernameFormControl.value,
      password: this.passwordFormControl.value,
      twoFactorsTotp: this.totpFormControl.value
    }

    const welcomeMessage = `Login success ! Welcome ${credentials.username}`;

    this.userService.authenticate(credentials).subscribe(response => {
      if (response.status === Constants.STATUS_SUCCESS) {
        if (response.message.startsWith('TOTP')) {
          // Credentials ok : enter TOTP form
          this.snackBar.open(response.message, 'Dismiss', {duration: 2000});
          this.enterTotp = true;
        } else {
          // Successful login : 
          // - set authenticated true, 
          // - keep jwt token in memory, 
          // - navigate to home
          this.userService.authenticated = true;
          sessionStorage.setItem(Constants.LOCAL_STORAGE_TOKEN, response.message);
          this.router.navigate(['/home']);
          this.snackBar.open(welcomeMessage, 'Dismiss', {duration: 2000});
        }
      }
      // Login failed : inactive account needs 2 factor activation
      if (response.status === Constants.STATUS_FAIL) {
        // Check if 2FA barCode is actually returned by API
        const data = response.data;
        if (data != null && data.length > 0) {
          this.userService.barCode = data[0].toString();
          this.userService.credentials = credentials;
          this.snackBar.open(response.message, 'Dismiss', {duration: 2000});
          this.router.navigate(['/activate-account']);
        }
      }
      // Error in login process : bad TOTP or bad credentials
      if (response.status === Constants.STATUS_ERROR) {
        console.log("error");
        if (response.message.startsWith('Error')) {
          // TOTP is not valid
          this.snackBar.open(response.message, 'Dismiss', {duration: 2000});
          this.totpFormControl.setValue('');
        } else {
          // Bad credentials
          this.snackBar.open(response.message, 'Dismiss', {duration: 2000});
        }
      }
    });

  }
}

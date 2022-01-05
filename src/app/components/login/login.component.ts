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

  twoFactorEnabled: boolean = false;
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
      // Successful login : set auth, keep token, navigate
      if (response.status === Constants.STATUS_SUCCESS) {
        this.userService.authenticated = true;
        sessionStorage.setItem(Constants.LOCAL_STORAGE_TOKEN, response.message);
        this.router.navigate(['/home']);
        this.snackBar.open(welcomeMessage, 'Dismiss', {duration: 2000});
      }
      // Failed login : 2 factors authentication required
      if (response.status === Constants.STATUS_FAIL) {
        // If 2FA already enabled => bad PIN
        if (this.twoFactorEnabled) {
          this.snackBar.open("Bad PIN. try again !", 'Dismiss', {duration: 2000});
          this.totpFormControl.setValue('');
        } else {
          this.snackBar.open(response.message, 'Dismiss', {duration: 2000});
          this.twoFactorEnabled = true;
        }
      }
      // Error in login process : Account disabled or bad credentials
      if (response.status === Constants.STATUS_ERROR) {
        if (response.message.startsWith('Inactive')) {
          // Account is not verified :
          this.snackBar.open(response.message, 'Dismiss', {duration: 2000});
          this.router.navigate(['/confirm-registration'])
        } else {
          // Bad credentials
          this.snackBar.open(response.message, 'Dismiss', {duration: 2000});
        }
      }
    });

  }

  private sendNewConfirmationEmail(username: string) {
    window.alert("FAKE : an email has been sent to the email address you provide when you signed in !")
  }
}

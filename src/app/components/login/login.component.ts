import {AfterViewInit, Component, OnInit} from '@angular/core';
import {FormControl, Validators} from "@angular/forms";
import {customErrorStateMatcher} from "../../utils/formHandler";
import {UserService} from "../../services/user.service";
import {Router} from "@angular/router";
import {Constants} from "../../utils/constants";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  usernameFormControl = new FormControl('', [Validators.required]);
  passwordFormControl = new FormControl('', [Validators.required]);
  matcher = new customErrorStateMatcher();
  error: boolean = false;
  errorMessage: string = "";

  constructor(private userService: UserService,
              private router: Router,
              private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
  }

  login() {
    const credentials = {
      username: this.usernameFormControl.value,
      password: this.passwordFormControl.value
    }
    const welcomeMessage = `Login success ! Welcome ${credentials.username}`;
    this.userService.authenticate(credentials).subscribe(response => {
      if (response.authSuccess) {
        this.userService.authenticated = true;
        sessionStorage.setItem(Constants.LOCAL_STORAGE_TOKEN, response.data);
        this.router.navigate(['/home']);
        this.snackBar.open(welcomeMessage, 'Dismiss', {duration: 2000});
      } else {
        this.error = true;
        this.errorMessage = response.data;
      }
    });
  }

}

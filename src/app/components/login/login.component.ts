import {AfterViewInit, Component, OnInit} from '@angular/core';
import {FormControl, Validators} from "@angular/forms";
import {customErrorStateMatcher} from "../../utils/formHandler";
import {UserService} from "../../services/user.service";
import {Router} from "@angular/router";



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  usernameFormControl = new FormControl('', [Validators.required]);
  passwordFormControl = new FormControl('', [Validators.required]);
  matcher = new customErrorStateMatcher();

  constructor(private userService: UserService,
              private router: Router) {
  }

  ngOnInit(): void {
  }

  login() {
    const credentials = {
      username: this.usernameFormControl.value,
      password: this.passwordFormControl.value
    }
    this.userService.authenticate(credentials).subscribe(response => {
      console.log("response : " + response.data)
      if (response.authSuccess) {
        this.userService.authenticated = true;
        sessionStorage.setItem('token', response.data);
        this.router.navigate(['/home']);
      } else {
        // TODO : popup error message
        // this.authenticated = false;
      }
    });
  }

}

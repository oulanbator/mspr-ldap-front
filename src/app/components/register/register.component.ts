import { Component, OnInit } from '@angular/core';
import {FormControl, Validators} from "@angular/forms";
import {customErrorStateMatcher} from "../../utils/formHandler";
import {UserService} from "../../services/user.service";
import {RegistrationRequest} from "../../models/http/RegistrationRequest";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css', '../login/login.component.css']
})
export class RegisterComponent implements OnInit {
  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  usernameFormControl = new FormControl('', [Validators.required]);
  passwordFormControl = new FormControl('', [Validators.required]);
  matcher = new customErrorStateMatcher();

  constructor(private userService: UserService) { }

  ngOnInit(): void {
  }

  signIn() {
    const userDetails: RegistrationRequest = {
      email: this.emailFormControl.value,
      username: this.usernameFormControl.value,
      password: this.passwordFormControl.value,
    }
    this.userService.register(userDetails).subscribe(data => {
      console.log(data);
    })
  }

}

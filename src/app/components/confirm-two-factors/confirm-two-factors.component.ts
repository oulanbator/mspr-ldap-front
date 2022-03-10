import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { timer } from 'rxjs';
import { AuthenticationRequest } from 'src/app/models/http/AuthenticationRequest';
import { TwoFactorsService } from 'src/app/services/two-factors.service';
import { UserService } from 'src/app/services/user.service';
import { Constants } from 'src/app/utils/constants';
import { customErrorStateMatcher } from 'src/app/utils/formHandler';
import { environment } from 'src/environments/environment';

const observableTimer = timer(1000, 1000);

@Component({
  selector: 'app-confirm-two-factors',
  templateUrl: './confirm-two-factors.component.html',
  styleUrls: ['../login/login.component.css', './confirm-two-factors.component.css']
})
export class ConfirmTwoFactorsComponent implements OnInit {
  credentials: AuthenticationRequest = {username: "", password: "", twoFactorsTotp: ""};
  secret: string = "";
  qrCodeUrl: string = "";
  accountActivation: boolean = false;
  accountActivated: boolean = false;
  secondsRemaining: number = 5;

  totpFormControl = new FormControl('', [Validators.required]);
  matcher = new customErrorStateMatcher();
  loading: boolean = false;

  constructor(private userService: UserService,
              private router: Router,
              private snackBar: MatSnackBar) {

    // If no barCode in userService, access denied, nav to login
    if (userService.barCode === "" || typeof userService.credentials === null) {
      this.navLogin();
    }
  }

  ngOnInit(): void {
    // Build component
    this.credentials = this.userService.credentials;
    const barCode = this.userService.barCode;
    this.secret = barCode.split("secret=")[1].split("&")[0];
    this.qrCodeUrl = environment.onlineQrCodeBaseUrl + barCode;
    // immediatly clean barCode var in userService
    this.userService.barCode = "";
  }

  navActivation() {
    this.accountActivation = true;
  }

  activate() {
    this.loading = true;
    this.credentials.twoFactorsTotp = this.totpFormControl.value;
    console.log(this.credentials);
    this.userService.authenticate(this.credentials!).subscribe(response => {
      console.log(response);
      if (response.status === Constants.STATUS_SUCCESS) {
        this.accountActivation = false;
        this.accountActivated = true;
        // Start timer to navigate login
        observableTimer.subscribe(_t => {
          this.secondsRemaining--;
          if (this.secondsRemaining === 0) {
            this.navLogin();
          }
        })
      } else {
        this.snackBar.open(response.message, 'Dismiss', {duration: 2000})
      }
    });
    this.loading = false;
  }

  navLogin() {
    this.router.navigate(['/login']);
  }

}

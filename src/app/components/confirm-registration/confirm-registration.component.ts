import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../../services/user.service";
import {Constants} from "../../utils/constants";
import {MatSnackBar} from "@angular/material/snack-bar";
import { timer } from 'rxjs';
import {TwoFactorsService} from "../../services/two-factors.service";
import {environment} from "../../../environments/environment";

const obsTimer = timer(1000, 1000);

@Component({
  selector: 'app-confirm-registration',
  templateUrl: './confirm-registration.component.html',
  styleUrls: ['../login/login.component.css', './confirm-registration.component.css']
})
export class ConfirmRegistrationComponent implements OnInit {
  twoFactors: boolean = false;
  barCode: string = "";
  secret: string = "";
  qrCodeUrl: string = "";
  accountVerified: boolean = false;
  secondsRemaining: number = 5;

  constructor(private userService: UserService,
              private twoFactorService: TwoFactorsService,
              private router: Router,
              private route: ActivatedRoute,
              private snackBar: MatSnackBar) {
    if (twoFactorService.twoFactorsEnabled) {
      // Get values from service
      this.twoFactors = twoFactorService.twoFactorsEnabled;
      this.barCode = twoFactorService.barCode;
      this.secret = this.barCode.split("secret=")[1].split("&")[0];
      this.qrCodeUrl = environment.onlineQrCodeBaseUrl + this.barCode;
      // Clean values in twoFactorService
      twoFactorService.twoFactorsEnabled = false;
      twoFactorService.barCode = "";
    }
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params.token) {
        console.log("Has token param")
        this.verifyToken(params.token);
      }
    });
  }

  navLogin() {
    this.router.navigate(['/login']);
  }

  verifyToken(token: string) {
    this.userService.verifyAccount(token).subscribe(response => {
      if (response.status === Constants.STATUS_SUCCESS) {
        this.accountVerified = true;
        // this.snackBar.open(response.message, "Dismiss", {duration: 3000})
        obsTimer.subscribe(_t => {
          this.secondsRemaining--;
          if (this.secondsRemaining === 0) {
            this.router.navigate(['/login']);
          }
        })
      }
    })
  }
}

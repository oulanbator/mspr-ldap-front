import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../../services/user.service";
import {Constants} from "../../utils/constants";

@Component({
  selector: 'app-verify-identity',
  templateUrl: './verify-identity.component.html',
  styleUrls: ['../login/login.component.css', './verify-identity.component.css']
})
export class VerifyIdentityComponent implements OnInit {
  hasToken: boolean = false;
  verificationMessage = ""

  constructor(private userService: UserService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params.token) {
        //console.log("Has token param")
        //console.log(params.token)
        this.verifyToken(params.token);
        this.hasToken = true;
      } else {
        this.verificationMessage = "Votre identité n'a pas pu être vérifiée. Le lien que vous avez suivi n'est pas valide.";
      }
    });
  }

  navLogin() {
    this.router.navigate(['/login']);
  }

  private verifyToken(token: string) {
    this.userService.verifyAccount(token).subscribe(response => {
      if (response.status === Constants.STATUS_FAIL) {
        this.verificationMessage = "Votre identité n'a pas pu être vérifiée. Le lien que vous avez suivi a expiré"
      }
      if (response.status === Constants.STATUS_SUCCESS) {
        this.verificationMessage = "Votre identité a pu être vérifiée avec succès ! Vous pouvez à présent vous connecter."
      }
    });
  }
}

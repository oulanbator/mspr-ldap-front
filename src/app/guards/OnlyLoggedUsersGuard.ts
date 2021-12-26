import {Injectable} from "@angular/core";
import {CanActivate, Router} from "@angular/router";
import {UserService} from "../services/user.service";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class OnlyLoggedUsersGuard implements CanActivate {

  constructor(private userService: UserService,
              private router: Router) {
  }

  canActivate() {
    console.log("OnlyLoggedUsersGuard");
    if (this.userService.isAuthenticated()) {
      // if already authenticated
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }

}

import {CanActivate, Router} from "@angular/router";
import {Injectable} from "@angular/core";
import {UserService} from "../services/user.service";

@Injectable({
  providedIn: 'root'
})
export class IsSignedInGuard implements CanActivate {
  constructor(private userService: UserService,private router: Router) { }
  canActivate(): boolean {
    if (this.userService.isAuthenticated()) {
      this.router.navigate(["/home"]); // or home
      return false;
    }
    return true;
  }
}

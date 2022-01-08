import {CanActivate, Router} from "@angular/router";
import {Injectable} from "@angular/core";
import {UserService} from "../services/user.service";
import {Observable, of} from "rxjs";
import {catchError, map} from "rxjs/operators";
import {Constants} from "../utils/constants";

@Injectable({
  providedIn: 'root'
})
export class NoLoggedUsersGuard implements CanActivate {
  constructor(private userService: UserService,private router: Router) { }

  canActivate(): Observable<boolean>{
    const token = sessionStorage.getItem(Constants.LOCAL_STORAGE_TOKEN);
    // If token is null or empty,
    // => user is not logged in, return true
    if (token === '' || token === null) {
      return of(true);
    } else {
    // If there is a token, check auth validity
      return this.userService.checkAuth().pipe(
        map((response) => {
          if (response.status == Constants.STATUS_SUCCESS) {
            // If server response is true, user is logged in, set authenticated true,
            // => return false (cannot access login page) and redirect to home
            this.userService.authenticated = true;
            this.router.navigate(['/home']);
            return false;
          } else {
            // If server response is false, something is wrong with token,
            // => user is not logged in, return true
            return true;
          }
        }),
        catchError((err) => {
          // If server error
          // => user is probably not logged in, return true
          return of(true);
        })
      );
    }
  }
}

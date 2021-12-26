import {Injectable, OnInit} from '@angular/core';
import {Credentials} from "../models/credentials";
import {AuthenticationResponse} from "../models/http/AuthenticationResponse";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {BooleanResponse} from "../models/http/BooleanResponse";
import {MessageResponse} from "../models/http/MessageResponse";
import {environment} from "../../environments/environment";
import {catchError} from "rxjs/operators";
import {of} from "rxjs";
import {Router} from "@angular/router";
import {RegistrationRequest} from "../models/http/RegistrationRequest";

@Injectable({
  providedIn: 'root'
})
export class UserService implements OnInit {
  urlAuthenticate: string = environment.apiUrlAuthenticate;
  urlCheckAuth: string = environment.apiUrlCheckAuth;
  urlLogout: string = environment.apiUrlLogout;
  urlRegister: string = environment.apiUrlRegister;

  authenticated: boolean = false;

  token = sessionStorage.getItem('token');
  headers = new HttpHeaders({
    "Authorization": "Bearer " + this.token,
    "Content-Type": "application/json"
  })

  constructor(private http: HttpClient, private router: Router) {
    this.checkAuth().subscribe(data => {
      if (typeof data != 'string') {
        this.authenticated = data.response;
        this.router.navigate(['/home']);

      } else {
        console.log(data);
      }
    });
  }

  ngOnInit() {
  }

  isAuthenticated() {
    return this.authenticated;
  }

  authenticate(credentials: Credentials) {
    // TODO : delete this line when everything ok
    // console.log("payload : " + JSON.stringify(credentials));
    return this.http.post<AuthenticationResponse>(this.urlAuthenticate, credentials);
  }

  checkAuth() {
    return this.http.get<BooleanResponse>(this.urlCheckAuth, {headers: this.headers}).pipe(
      catchError(err => of("Could not find user session"))
    );
  }

  logout() {
    return this.http.get<MessageResponse>(this.urlLogout, {headers: this.headers});
  }

  register(userDetails: RegistrationRequest) {
    // TODO : delete this line when everything ok
    console.log("payload : " + JSON.stringify(userDetails));
    return this.http.post<MessageResponse>(this.urlRegister, userDetails);
  }
}

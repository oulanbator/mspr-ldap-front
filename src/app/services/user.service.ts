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
import {SimpleStringRequest} from "../models/http/SimpleStringRequest";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Constants} from "../utils/constants";

@Injectable({
  providedIn: 'root'
})
export class UserService implements OnInit {
  urlAuthenticate: string = environment.apiUrlAuthenticate;
  urlCheckAuth: string = environment.apiUrlCheckAuth;
  urlLogout: string = environment.apiUrlLogout;
  urlRegister: string = environment.apiUrlRegister;
  urlEmailAvailable: string = environment.apiUrlEmailAvailable;
  private urlUsernameAvailable: string = environment.apiUrlUsernameAvailable;

  authenticated: boolean = false;

  token = sessionStorage.getItem(Constants.LOCAL_STORAGE_TOKEN);
  headers = new HttpHeaders({
    "Authorization": "Bearer " + this.token,
    "Content-Type": "application/json"
  })

  constructor(private http: HttpClient,
              private router: Router,
              private snackBar: MatSnackBar) {
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
    return this.http.get<BooleanResponse>(this.urlCheckAuth, {headers: this.headers});
  }

  logout() {
    return this.http.get<MessageResponse>(this.urlLogout, {headers: this.headers});
  }

  register(userDetails: RegistrationRequest) {
    return this.http.post<MessageResponse>(this.urlRegister, userDetails);
  }

  checkEmailAvailable(email: SimpleStringRequest) {
    return this.http.post<MessageResponse>(this.urlEmailAvailable, email);
  }

  checkUsernameAvailable(username: SimpleStringRequest) {
    return this.http.post<MessageResponse>(this.urlUsernameAvailable, username);
  }
}

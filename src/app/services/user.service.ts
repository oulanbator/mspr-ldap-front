import {Injectable, OnInit} from '@angular/core';
import {AuthenticationRequest} from "../models/http/AuthenticationRequest";
import {AuthenticationResponse} from "../models/http/AuthenticationResponse";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {BooleanResponse} from "../models/http/BooleanResponse";
import {MessageResponse} from "../models/http/MessageResponse";
import {environment} from "../../environments/environment";
import {catchError} from "rxjs/operators";
import {Observable, of} from "rxjs";
import {Router} from "@angular/router";
import {RegistrationRequest} from "../models/http/RegistrationRequest";
import {SimpleStringRequest} from "../models/http/SimpleStringRequest";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Constants} from "../utils/constants";
import {StandardApiResponse} from "../models/http/StandardApiResponse";

@Injectable({
  providedIn: 'root'
})
export class UserService implements OnInit {
  urlAuthenticate: string = environment.apiUrlAuthenticate;
  urlCheckAuth: string = environment.apiUrlCheckAuth;
  urlLogout: string = environment.apiUrlLogout;
  urlRegister: string = environment.apiUrlRegister;
  urlEmailAvailable: string = environment.apiUrlEmailAvailable;
  urlVerifyAccount: string = environment.apiUrlVerifyAccount;
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

  authenticate(credentials: AuthenticationRequest) {
    return this.http.post<StandardApiResponse>(this.urlAuthenticate, credentials);
  }

  checkAuth() {
    return this.http.get<BooleanResponse>(this.urlCheckAuth, {headers: this.headers});
  }

  logout() {
    return this.http.get<MessageResponse>(this.urlLogout, {headers: this.headers});
  }

  register(userDetails: RegistrationRequest) {
    return this.http.post<StandardApiResponse>(this.urlRegister, userDetails).pipe(
      catchError(error => handleServerConnectivityErrors(error))
    );
  }

  verifyAccount(token: string) {
    return this.http.get<StandardApiResponse>(this.urlVerifyAccount + token);
  }

  checkEmailAvailable(email: SimpleStringRequest) {
    return this.http.post<StandardApiResponse>(this.urlEmailAvailable, email).pipe(
      catchError(error => handleServerConnectivityErrors(error))
    );
  }

  checkUsernameAvailable(username: SimpleStringRequest) {
    return this.http.post<StandardApiResponse>(this.urlUsernameAvailable, username).pipe(
      catchError(error => handleServerConnectivityErrors(error))
    );
  }
}

// Utility

function handleServerConnectivityErrors(error: any): Observable<StandardApiResponse> {
  if (error.status == 0) {
    const response: StandardApiResponse = {status: 'error', message: "Could not reach the server", statusCode: 0, data: null};
    return of(response);
  }
  const response: StandardApiResponse = {status: 'error', message: "Unknown error. Contact developers team.", statusCode: 500, data: null};
  return of(response);
}

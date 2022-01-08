import {Injectable, OnInit} from '@angular/core';
import {AuthenticationRequest} from "../models/http/AuthenticationRequest";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable, of} from "rxjs";
import {Router} from "@angular/router";
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

  authenticated: boolean = false;
  barCode: string = "";
  credentials: AuthenticationRequest = {username: "", password: "", twoFactorsTotp: ""};

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
    return this.http.get<StandardApiResponse>(this.urlCheckAuth, {headers: this.headers});
  }

  logout() {
    return this.http.get<StandardApiResponse>(this.urlLogout, {headers: this.headers});
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

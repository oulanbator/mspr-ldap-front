import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {LoginComponent} from "./components/login/login.component";
import {RouterModule} from "@angular/router";
import {RegisterComponent} from "./components/register/register.component";
import {HomeComponent} from "./components/home/home.component";
import {OnlyLoggedUsersGuard} from "./guards/OnlyLoggedUsersGuard";
import {IsSignedInGuard} from "./guards/IsSignedInGuard";

const routes = [
  { path: 'login', component: LoginComponent, canActivate: [IsSignedInGuard]},
  { path: 'register', component: RegisterComponent },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [OnlyLoggedUsersGuard]
  },
  { path: '**', redirectTo: 'home' }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

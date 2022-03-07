import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {LoginComponent} from "./components/login/login.component";
import {RouterModule} from "@angular/router";
import {HomeComponent} from "./components/home/home.component";
import {OnlyLoggedUsersGuard} from "./guards/OnlyLoggedUsersGuard";
import {NoLoggedUsersGuard} from "./guards/NoLoggedUsersGuard";
import { ConfirmTwoFactorsComponent } from './components/confirm-two-factors/confirm-two-factors.component';
import {VerifyIdentityComponent} from "./components/verify-identity/verify-identity.component";

const routes = [
  { path: 'login', component: LoginComponent, canActivate: [NoLoggedUsersGuard]},
  { path: 'activate-account', component: ConfirmTwoFactorsComponent},
  { path: 'verify-identity', component: VerifyIdentityComponent},
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

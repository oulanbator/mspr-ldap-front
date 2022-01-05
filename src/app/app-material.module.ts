import { NgModule } from '@angular/core';
import {MatInputModule} from "@angular/material/input";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {MatDividerModule} from "@angular/material/divider";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatIconModule} from "@angular/material/icon";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatCheckboxModule} from "@angular/material/checkbox";

const matModules = [
  MatFormFieldModule,
  MatInputModule,
  MatCardModule,
  MatButtonModule,
  MatDividerModule,
  MatToolbarModule,
  MatIconModule,
  MatSnackBarModule,
  MatProgressSpinnerModule,
  MatCheckboxModule
]

@NgModule({
  imports: [matModules],
  exports: [matModules]
})
export class AppMaterialModule { }

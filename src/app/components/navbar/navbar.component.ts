import { Component, OnInit } from '@angular/core';
import {UserService} from "../../services/user.service";
import {Router} from "@angular/router";
import {Constants} from "../../utils/constants";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private userService: UserService,
              private router: Router) { }

  ngOnInit(): void {
  }

  logout() {
    this.userService.logout().subscribe(response => {
      this.userService.authenticated = false;
      sessionStorage.setItem(Constants.LOCAL_STORAGE_TOKEN, '');
      this.router.navigate(['/login']);
    });
  }
}

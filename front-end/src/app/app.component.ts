import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(public authService: AuthService, public router: Router) { }

  public isLoggedIn() {
    return this.authService.isLoggedIn()
  }

  public isTeacher() {
    return this.authService.getCurrentUser() && this.authService.getCurrentUser().is_teacher
  }
}

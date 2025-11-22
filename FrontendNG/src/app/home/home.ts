import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SessionHelper } from '../shared/session-helper';

@Component({
  selector: 'app-home',
  imports: [RouterLink, CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

  // Check if user is logged in
  isUserLoggedIn(): boolean {
    return SessionHelper.isUserLoggedIn();
  }

  onLogin() {
    throw new Error('Method not implemented.');
  }
  
  onRegister() {
    throw new Error('Method not implemented.');
  }
}

import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { SessionHelper } from '../shared/session-helper';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule, CommonModule, HttpClientModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar implements OnInit {

  // Simple variables to store user session data
  isLoggedIn: boolean = false;
  userName: string = '';
  userRole: string = '';
  userId: string = '';
  sessionId: string = '';

  constructor(private router: Router, private http: HttpClient) {
    // Listen for storage changes to refresh navbar when user logs in
    window.addEventListener('storage', () => {
      this.refreshNavbar();
    });
  }

  ngOnInit() {
    // Check session data when component loads
    this.checkSessionData();
  }

  // STEP 1: Check if user is logged in by reading localStorage
  checkSessionData() {
    this.isLoggedIn = SessionHelper.isUserLoggedIn();

    if (this.isLoggedIn) {
      this.userName = SessionHelper.getUserName();
      this.userRole = SessionHelper.getUserRole();
      this.userId = SessionHelper.getUserId();
      this.sessionId = SessionHelper.getSessionId();
    } else {
      this.isLoggedIn = false;
      this.userName = '';
      this.userRole = '';
      this.userId = '';
      this.sessionId = '';
    }
  }

  // STEP 1B: Refresh navbar - call this manually after login
  refreshNavbar() {
    this.checkSessionData();
  }

  // STEP 2: Logout function - call backend and clear localStorage
  logout() {
    // Call backend logout API with session
    this.http.post('http://localhost:8080/api/logout', {}, SessionHelper.getHttpOptionsWithCredentials()).subscribe({
      next: (res) => {
        console.log('Logout response:', res);

        // Clear session data using helper
        SessionHelper.clearSession();

        // Reset navbar variables
        this.isLoggedIn = false;
        this.userName = '';
        this.userRole = '';
        this.userId = '';
        this.sessionId = '';

        // Navigate to login page
        this.router.navigate(['/login']);

        alert('Logged out successfully!');
      },
      error: (err) => {
        console.error('Logout error:', err);
        // Even if backend fails, clear localStorage
        SessionHelper.clearSession();
        this.isLoggedIn = false;
        this.router.navigate(['/login']);
      }
    });
  }

  // STEP 3: Navigate to user's dashboard based on role
  goToDashboard() {
    switch (this.userRole) {
      case 'ADMIN':
        this.router.navigate(['/adminDashboard']);
        break;
      case 'RECEPTION':
        this.router.navigate(['/listAllBookings']);
        break;
      case 'CUSTOMER':
        this.router.navigate(['/customerDashboard']);
        break;
      default:
        this.router.navigate(['/home']);
    }
  }
}

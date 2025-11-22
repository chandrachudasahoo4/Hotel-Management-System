import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  imports: [CommonModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class AdminDashboard {

  // Simple variables to show user info
  userName: string = '';
  userRole: string = '';
  isAuthorized: boolean = false;

  constructor(private router: Router) {
    // Check if user is logged in and has admin role
    this.checkUserAccess();
  }

  // STEP 1: Check if user can access admin dashboard
  checkUserAccess() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userRole = localStorage.getItem('userRole');
    const userName = localStorage.getItem('userName');

    if (isLoggedIn === 'true' && userRole === 'ADMIN') {
      // User is authorized
      this.isAuthorized = true;
      this.userName = userName || '';
      this.userRole = userRole || '';
    } else {
      // User not authorized - redirect to login
      this.isAuthorized = false;
      alert('Access denied! Admin role required.');
      this.router.navigate(['/login']);
    }
  }

  // STEP 2: Logout function (same as navbar)
  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
    alert('Logged out successfully!');
  }

  // STEP 3: Navigation methods for the main actions

  goToRoomManagement() {
    // Navigate to room management component
    this.router.navigate(['/roomManagement']);
  }

  goToAllBookings() {
    // Navigate to list all bookings component
    this.router.navigate(['/listAllBookings']);
  }

  goToReceptionReg() {
    // Navigate to reception registration component
    this.router.navigate(['/receptionReg']);
  }

  // goToConflicts() {
  //   // For now, show a simple alert with conflict check
  //   alert('Checking for booking conflicts...');
  //   // TODO: Create a proper conflicts component later
  //   // this.router.navigate(['/booking-conflicts']);
  // }


}

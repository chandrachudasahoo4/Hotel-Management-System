import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SessionHelper } from '../shared/session-helper';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink, HttpClientModule, CommonModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  loginInput = { email: '', password: '' };
  loginMsg = '';
  submitted = false;
  showPassword = false;

  constructor(private http: HttpClient, private router: Router) { }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  login() {
     // Simple patterns for validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Basic validation before sending to backend
    if (!this.loginInput.email || !this.loginInput.password) {
      this.loginMsg = 'All fields are required.';
      return;
    }

    if (!emailPattern.test(this.loginInput.email)) {
      this.loginMsg = 'Invalid email address.';
      return;
    }


    this.http.post('http://localhost:8080/api/login', this.loginInput, SessionHelper.getHttpOptionsWithCredentials()).subscribe({
      next: (res) => {
        const result = res as any;

        if (result.status === 'success') {
          
          // STEP 1: Store session data in localStorage (manually and simple)
          localStorage.setItem('sessionId', result.sessionId);
          localStorage.setItem('userId', result.userId.toString());
          localStorage.setItem('userName', result.userName);
          localStorage.setItem('userRole', result.role);
          localStorage.setItem('userEmail', this.loginInput.email);
          localStorage.setItem('isLoggedIn', 'true');
          
          // STEP 1.5: Simple way to refresh navbar - trigger storage event
          // This tells the navbar that localStorage changed
          window.dispatchEvent(new Event('storage'));
          
          // STEP 2: Show success message
          this.loginMsg = 'Login successful! Welcome ' + result.userName;
          
          // STEP 3: Navigate based on role (after short delay to show message)
          setTimeout(() => {
            switch (result.role) {
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
                this.loginMsg = 'Unknown role';
            }
          }, 1000); // Wait 1 second to show success message
          
        } else {
          this.loginMsg = result.message;
        }
      },
      error: () => {
        this.loginMsg = 'Server error';
      }
    });
  }
}

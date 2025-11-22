import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SessionHelper } from '../shared/session-helper';

@Component({
  selector: 'app-reception-reg',
  standalone: true, 
  imports: [RouterLink, FormsModule, HttpClientModule, CommonModule], 
  templateUrl: './receptionReg.html',
  styleUrls: ['./receptionReg.css'] 
})
export class ReceptionReg {
  registerInput = {
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  };
  registerMsg = '';
  showPassword = false;

  constructor(private http: HttpClient, private router: Router) {
    // Check if user is admin before allowing access
    this.checkAdminAccess();
  }

  // Check if user has admin access
  checkAdminAccess() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userRole = localStorage.getItem('userRole');

    if (isLoggedIn !== 'true' || userRole !== 'ADMIN') {
      alert('Access denied! Admin role required.');
      this.router.navigate(['/admin-dashboard']);
    }
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  register() {
    // Simple patterns for validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

    // Basic validation before sending to backend
    if (!this.registerInput.firstName || !this.registerInput.lastName || 
        !this.registerInput.email || !this.registerInput.password) {
      this.registerMsg = 'All fields are required.';
      return;
    }

    if (!emailPattern.test(this.registerInput.email)) {
      this.registerMsg = 'Invalid email address.';
      return;
    }

    if (!passwordPattern.test(this.registerInput.password)) {
      this.registerMsg = 'Weak password. Must include at least 1 uppercase letter, 1 lowercase letter, 1 number, and be 8+ characters long.';
      return;
    }

    // If validation passes, call reception registration API
    const httpOptions = SessionHelper.getHttpOptionsWithCredentials();
    
    this.http.post('http://localhost:8080/api/register/reception', this.registerInput, httpOptions).subscribe({
      next: (res) => {
        const result = res as any;
        if (result.status === 'success') {
          this.registerMsg = 'Receptionist registered successfully!';
          setTimeout(() => {
            this.router.navigate(['/admin-dashboard']);
          }, 2000);
        } else {
          this.registerMsg = result.message;
        }
      },
      error: () => {
        this.registerMsg = 'Server error';
      }
    });
  }
}
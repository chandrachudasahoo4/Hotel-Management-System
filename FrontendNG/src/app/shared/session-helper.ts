// Simple HTTP Helper for Session-based Requests
// This file helps make HTTP requests that include session cookies

import { HttpHeaders } from '@angular/common/http';

export class SessionHelper {
  
  // STEP 1: Get HTTP options that include credentials for session
  static getHttpOptions() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
      // Temporarily removed withCredentials until backend CORS is fixed
      // withCredentials: true  // This includes session cookies
    };
  }

  // STEP 1b: Get HTTP options WITH credentials (use after backend restart)
  static getHttpOptionsWithCredentials() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      withCredentials: true  // This includes session cookies
    };
  }

  // STEP 2: Check if user is logged in
  static isUserLoggedIn(): boolean {
    return localStorage.getItem('isLoggedIn') === 'true';
  }

  // STEP 3: Get current user role
  static getUserRole(): string {
    return localStorage.getItem('userRole') || '';
  }

  // STEP 4: Get current user name
  static getUserName(): string {
    return localStorage.getItem('userName') || '';
  }

  // STEP 5: Get current user ID
  static getUserId(): string {
    return localStorage.getItem('userId') || '';
  }

  // STEP 6: Get session ID
  static getSessionId(): string {
    return localStorage.getItem('sessionId') || '';
  }

  // STEP 7: Clear all session data
  static clearSession() {
    localStorage.removeItem('sessionId');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('isLoggedIn');
  }

  // STEP 8: Check if user has specific role
  static hasRole(role: string): boolean {
    return this.getUserRole() === role;
  }
}
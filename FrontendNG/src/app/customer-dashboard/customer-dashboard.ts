import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { SessionHelper } from '../shared/session-helper';

interface Booking {
  id: number;
  bookingConfirmationCode: string;
  checkinDate: string;
  checkoutDate: string;
  numOfChildren: number;
  totalNumOfGuest: number;
  totalFee: number;
  status: string;
  roomId: number;
  userId: number;
}

@Component({
  selector: 'app-customer-dashboard',
  imports: [CommonModule, HttpClientModule],
  templateUrl: './customer-dashboard.html',
  styleUrl: './customer-dashboard.css'
})
export class CustomerDashboard implements OnInit {

  // Main properties
  bookings: Booking[] = [];
  loading = false;
  error = '';
  userId = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.userId = SessionHelper.getUserId();
    console.log('Current User ID:', this.userId);
    
    if (this.userId) {
      this.loadUserBookings();
    } else {
      this.error = 'Please login to view your bookings';
    }
  }

  loadUserBookings() {
    this.loading = true;
    this.error = '';
    
    const apiUrl = `http://localhost:8080/api/bookings/by-user/${this.userId}`;
    
    this.http.get<any>(apiUrl).subscribe({
      next: (response) => {
        console.log('Bookings response:', response);
        
        if (response.status === 'success') {
          this.bookings = this.sortBookingsByStatus(response.bookings || []);
        } else {
          this.error = response.message || 'Failed to load bookings';
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading bookings:', err);
        this.error = 'Failed to load bookings. Please try again.';
        this.loading = false;
      }
    });
  }

  // Sort bookings to show PENDING at top
  sortBookingsByStatus(bookings: Booking[]): Booking[] {
    return bookings.sort((a, b) => {
      // PENDING bookings go to top
      if (a.status.toLowerCase() === 'pending' && b.status.toLowerCase() !== 'pending') {
        return -1;
      }
      if (b.status.toLowerCase() === 'pending' && a.status.toLowerCase() !== 'pending') {
        return 1;
      }
      // For same status or non-pending, maintain original order
      return 0;
    });
  }

  cancelBooking(bookingId: number) {
    if (!confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    const apiUrl = `http://localhost:8080/api/bookings/${bookingId}/cancel`;

    this.http.put(apiUrl, {}, SessionHelper.getHttpOptionsWithCredentials()).subscribe({
      next: (response: any) => {
        console.log('Cancel response:', response);
        
        if (response.status === 'success') {
          this.showToast('success', 'Booking cancelled successfully!');
          this.loadUserBookings(); // Reload bookings (will be sorted automatically)
        } else {
          this.showToast('error', response.message || 'Failed to cancel booking');
        }
      },
      error: (error) => {
        console.error('Error cancelling booking:', error);
        this.showToast('error', 'Failed to cancel booking. Please try again.');
      }
    });
  }



  // Toast notification system
  showToast(type: 'success' | 'error' | 'warn', message: string) {
    // Simple toast implementation
    const existingToasts = document.querySelectorAll('.toast');
    existingToasts.forEach(toast => toast.remove());

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    Object.assign(toast.style, {
      position: 'fixed',
      top: '20px',
      right: '20px',
      padding: '12px 24px',
      borderRadius: '8px',
      color: 'white',
      backgroundColor: type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#f59e0b',
      zIndex: '1000',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
    });

    document.body.appendChild(toast);
    
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 4000);
  }
}
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
  otp?: string; // OTP field from booking data
}

@Component({
  selector: 'app-listAllBookings',
  imports: [CommonModule, FormsModule],
  templateUrl: './listAllBookings.html',
  styleUrl: './listAllBookings.css'
})
export class ListAllBookings implements OnInit {
  bookings: Booking[] = [];
  loading = true;
  error = '';

  // OTP Modal properties
  showOtpModal = false;
  otpInput = '';
  currentBookingForCheckout: Booking | null = null;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    // Check if user has access (admin or reception)
    this.checkUserAccess();
    this.fetchAllBookings();
  }

  // Check if user can access this page
  checkUserAccess() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userRole = localStorage.getItem('userRole');

    if (isLoggedIn !== 'true' || (userRole !== 'ADMIN' && userRole !== 'RECEPTION')) {
      alert('Access denied! Admin or Reception role required.');
      this.router.navigate(['/login']);
    }
  }

  fetchAllBookings() {
    this.loading = true;
    const httpOptions = SessionHelper.getHttpOptionsWithCredentials();
    
    this.http.get<any>('http://localhost:8080/api/bookings/history', httpOptions)
      .subscribe({
        next: (response) => {
          if (response.status === 'success') {
            this.bookings = this.sortBookingsByStatus(response.bookings);
            console.log('Fetched bookings:', this.bookings);
          } else {
            this.error = response.message || 'Failed to fetch bookings';
          }
          this.loading = false;
        },
        error: (err) => {
          console.error('Error fetching bookings:', err);
          this.error = 'Failed to load booking data';
          this.loading = false;
        }
      });
  }

  sortBookingsByStatus(bookings: Booking[]): Booking[] {
    return bookings.sort((a, b) => {
      // Pending bookings go to top
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

  goBack() {
    // Check user role to navigate to appropriate dashboard
    const userRole = localStorage.getItem('userRole');
    if (userRole === 'ADMIN') {
      this.router.navigate(['/adminDashboard']);
    } else if (userRole === 'RECEPTION') {
      // For reception, go back to home since they don't have a dashboard
      this.router.navigate(['/home']);
    } else {
      this.router.navigate(['/login']);
    }
  }

  refreshBookings() {
    this.fetchAllBookings();
  }

  cancelBooking(booking: Booking) {
    if (confirm(`Are you sure you want to cancel booking ID: ${booking.id}?`)) {
      const httpOptions = SessionHelper.getHttpOptionsWithCredentials();
      
      this.http.put<any>(`http://localhost:8080/api/bookings/${booking.id}/cancel`, {}, httpOptions)
        .subscribe({
          next: (response) => {
            if (response.status === 'success') {
              console.log('Booking cancelled successfully:', response);
              // Update the booking status in the local array
              booking.status = 'CANCELLED';
              // Re-sort the bookings to move cancelled booking down
              this.bookings = this.sortBookingsByStatus(this.bookings);
              alert('Booking cancelled successfully!');
            } else {
              console.error('Cancel failed:', response);
              alert('Failed to cancel booking: ' + (response.message || 'Unknown error'));
            }
          },
          error: (err) => {
            console.error('Error cancelling booking:', err);
            alert('Failed to cancel booking. Please try again.');
          }
        });
    }
  }

  checkoutBooking(booking: Booking) {
    // Show OTP modal for checkout verification
    this.currentBookingForCheckout = booking;
    this.otpInput = '';
    this.showOtpModal = true;
    
    // Log the booking's OTP for debugging (removed alert for production use)
    if (booking.otp) {
      console.log('Booking OTP:', booking.otp);
    } else {
      // Fallback: use booking confirmation code as OTP if no OTP field
      console.log('Using confirmation code as OTP:', booking.bookingConfirmationCode);
    }
  }

  closeOtpModal() {
    this.showOtpModal = false;
    this.otpInput = '';
    this.currentBookingForCheckout = null;
  }

  verifyOtpAndCheckout() {
    if (!this.currentBookingForCheckout) {
      alert('No booking selected for checkout');
      return;
    }

    const expectedOtp = this.currentBookingForCheckout.otp || this.currentBookingForCheckout.bookingConfirmationCode;
    
    if (this.otpInput === expectedOtp) {
      // OTP matches, proceed with checkout
      const httpOptions = SessionHelper.getHttpOptionsWithCredentials();
      
      this.http.put<any>(`http://localhost:8080/api/bookings/${this.currentBookingForCheckout.id}/complete`, {}, httpOptions)
        .subscribe({
          next: (response) => {
            if (response.status === 'success') {
              console.log('Booking checked out successfully:', response);
              // Update the booking status in the local array
              this.currentBookingForCheckout!.status = 'COMPLETED';
              // Re-sort the bookings to move completed booking down
              this.bookings = this.sortBookingsByStatus(this.bookings);
              alert('Booking checked out successfully!');
              this.closeOtpModal();
            } else {
              console.error('Checkout failed:', response);
              alert('Failed to checkout booking: ' + (response.message || 'Unknown error'));
            }
          },
          error: (err) => {
            console.error('Error checking out booking:', err);
            alert('Failed to checkout booking. Please try again.');
          }
        });
    } else {
      alert('Invalid OTP. Please try again.');
    }
  }

  getPendingCount(): number {
    return this.bookings.filter(booking => 
      booking.status.toLowerCase() === 'pending'
    ).length;
  }
}
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { SessionHelper } from '../shared/session-helper';

interface Room {
  id: number;
  roomDesc: string;
  roomPrice: number;
  roomType: string;
  airConditioned: boolean;
}

interface BookingRequest {
  bookingConfirmationCode: string;
  checkinDate: string;
  checkoutDate: string;
  numOfChildren: number;
  totalNumOfGuest: number;
  room: { id: number };
  user: { id: number };
  totalFee: number;
}

@Component({
  selector: 'app-bookRoom',
  imports: [FormsModule],
  templateUrl: './bookRoom.html',
  styleUrl: './bookRoom.css'
})
export class BookRoom implements OnInit {
  room: Room | null = null;
  loading = true;
  error = '';
  roomId: number = 0;
  
  // Booking form data
  checkinDate: string = '';
  checkoutDate: string = '';
  numOfChildren: number = 0;
  totalNumOfGuest: number = 1;
  
  // Calculated values
  numberOfDays: number = 0;
  totalFee: number = 0;
  
  // Booking status
  isBooking = false;
  bookingSuccess = false;
  
  // Toast notification
  showToast = false;
  toastType: 'success' | 'warn' | 'error' = 'success';
  toastMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    // Check if user is logged in
    if (!SessionHelper.isUserLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    // Verify backend session is also valid
    this.verifyBackendSession();

    // Get room ID from route
    this.roomId = parseInt(this.route.snapshot.paramMap.get('id') || '0');
    
    if (this.roomId > 0) {
      this.fetchRoomDetails();
      this.setDefaultDates();
    } else {
      this.error = 'Invalid room ID';
      this.loading = false;
    }
  }

  verifyBackendSession() {
    const httpOptions = SessionHelper.getHttpOptionsWithCredentials();
    
    this.http.get<any>('http://localhost:8080/api/session', httpOptions)
      .subscribe({
        next: (response) => {
          if (response.status !== 'success' || !response.isLoggedIn) {
            console.warn('Backend session is invalid. Frontend thinks user is logged in but backend session is empty.');
            
            this.showToastMessage('Your session has expired. Please login again.', 'warn');
            SessionHelper.clearSession();
            
            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 2000);
          }
        },
        error: (err) => {
          console.error('Session verification failed:', err);
          this.showToastMessage('Session expired. Please login again.', 'warn');
          SessionHelper.clearSession();
          
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        }
      });
  }

  fetchRoomDetails() {
    const httpOptions = SessionHelper.getHttpOptionsWithCredentials();
    
    this.http.get<any>(`http://localhost:8080/api/rooms/${this.roomId}`, httpOptions)
      .subscribe({
        next: (response) => {
          if (response.status === 'success') {
            this.room = response.room;
          } else {
            this.error = response.message || 'Failed to load room details';
          }
          this.loading = false;
        },
        error: (err) => {
          console.error('Error fetching room details:', err);
          this.error = 'Failed to load room details';
          this.loading = false;
        }
      });
  }

  setDefaultDates() {
    const today = new Date();
    
    this.checkinDate = today.toISOString().split('T')[0];
    this.checkoutDate = ''; // Leave blank to force user selection
    this.calculateTotal();
  }

  onDateChange() {
    this.calculateTotal();
  }

  calculateTotal() {
    if (this.checkinDate && this.checkoutDate && this.room) {
      const checkin = new Date(this.checkinDate);
      const checkout = new Date(this.checkoutDate);
      
      if (checkout > checkin) {
        // Calculate difference in days
        const timeDiff = checkout.getTime() - checkin.getTime();
        this.numberOfDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
        this.totalFee = parseFloat((this.numberOfDays * this.room.roomPrice).toFixed(2));
      } else if (checkout.getTime() === checkin.getTime()) {
        // Same day booking - treat as 1 day
        this.numberOfDays = 1;
        this.totalFee = parseFloat((this.numberOfDays * this.room.roomPrice).toFixed(2));
      } else {
        // Check-out before check-in - invalid
        this.numberOfDays = 0;
        this.totalFee = 0;
      }
    }
  }

  generateConfirmationCode(): string {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }

  isInvalidDateRange(): boolean {
    if (!this.checkinDate || !this.checkoutDate) return false;
    return new Date(this.checkoutDate) < new Date(this.checkinDate);
  }

  showToastMessage(message: string, type: 'success' | 'warn' | 'error') {
    this.toastMessage = message;
    this.toastType = type;
    this.showToast = true;
    
    // Auto hide after 5 seconds
    setTimeout(() => {
      this.hideToast();
    }, 5000);
  }

  hideToast() {
    this.showToast = false;
  }

  redirectBasedOnRole() {
    const userRole = SessionHelper.getUserRole();
    
    setTimeout(() => {
      switch (userRole) {
        case 'ADMIN':
          this.router.navigate(['/adminDashboard']);
          break;
        case 'RECEPTION':
          this.router.navigate(['/receptionDashboard']);
          break;
        case 'CUSTOMER':
          this.router.navigate(['/customerDashboard']);
          break;
        default:
          this.router.navigate(['/home']);
      }
    }, 3000); // Wait 3 seconds before redirect
  }

  processPayment() {
    if (!this.room || this.totalFee <= 0) {
      this.showToastMessage('Please check your booking details', 'warn');
      return;
    }

    if (!this.checkoutDate) {
      this.showToastMessage('Please select a check-out date', 'warn');
      return;
    }

    if (this.isInvalidDateRange()) {
      this.showToastMessage('Please select valid check-in and check-out dates', 'warn');
      return;
    }

    this.isBooking = true;
    const userId = parseInt(SessionHelper.getUserId() || '0');
    
    const bookingData: BookingRequest = {
      bookingConfirmationCode: this.generateConfirmationCode(),
      checkinDate: this.checkinDate,
      checkoutDate: this.checkoutDate,
      numOfChildren: this.numOfChildren,
      totalNumOfGuest: this.totalNumOfGuest,
      room: { id: this.roomId },
      user: { id: userId },
      totalFee: this.totalFee
    };

    const httpOptions = SessionHelper.getHttpOptionsWithCredentials();
    
    console.log('Sending booking data:', bookingData);
    console.log('HTTP options:', httpOptions);
    
    this.http.post<any>('http://localhost:8080/api/bookings', bookingData, httpOptions)
      .subscribe({
        next: (response) => {
          console.log('Backend response:', response);
          
          // Check if response has status field (wrapped response) or is direct booking object
          if (response.status === 'success' || response.id) {
            this.bookingSuccess = true;
            const confirmationCode = response.confirmationCode || response.bookingConfirmationCode || bookingData.bookingConfirmationCode;
            this.showToastMessage(`Booking confirmed! Confirmation code: ${confirmationCode}`, 'success');
            this.redirectBasedOnRole();
          } else {
            console.error('Booking failed with response:', response);
            this.showToastMessage('Booking failed: ' + (response.message || 'Unknown error occurred'), 'error');
          }
          this.isBooking = false;
        },
        error: (err) => {
          console.error('HTTP Error:', err);
          console.error('Error status:', err.status);
          console.error('Error message:', err.message);
          console.error('Error body:', err.error);
          
          let errorMessage = 'Booking failed. Please try again.';
          if (err.error && err.error.message) {
            errorMessage = 'Booking failed: ' + err.error.message;
          } else if (err.message) {
            errorMessage = 'Booking failed: ' + err.message;
          } else if (err.status === 0) {
            errorMessage = 'Cannot connect to server. Please check if the backend is running.';
          } else if (err.status >= 400 && err.status < 500) {
            errorMessage = 'Invalid request. Please check your booking details.';
          } else if (err.status >= 500) {
            errorMessage = 'Server error. Please try again later.';
          }
          
          this.showToastMessage(errorMessage, 'error');
          this.isBooking = false;
        }
      });
  }

  goBack() {
    this.router.navigate(['/roomDetails', this.roomId]);
  }

  formatCurrency(amount: number): string {
    return `₹${amount.toFixed(2)}`;
  }

  formatRoomPrice(price: number): string {
    return `₹${price.toFixed(2)}`;
  }
}
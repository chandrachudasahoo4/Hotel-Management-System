import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Room {
  roomDesc: string;
  roomType: string;
  roomPrice: number;
  airConditioned: boolean;
}

@Component({
  selector: 'app-add-room',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './addRoom.html',
  styleUrls: ['./addRoom.css']
})
export class AddRoomComponent {
  room: Room = {
    roomDesc: '',
    roomType: 'Single',
    roomPrice: 0,
    airConditioned: false
  };

  roomTypes = ['Single', 'Double', 'Deluxe', 'Suite'];
  isSubmitting = false;
  successMessage = '';
  errorMessage = '';

  constructor(private router: Router, private http: HttpClient) {}

  onSubmit(): void {
    if (this.isSubmitting) return;

    // Basic validation
    if (!this.room.roomDesc.trim()) {
      this.showError('Room description is required');
      return;
    }

    if (this.room.roomPrice <= 0) {
      this.showError('Room price must be greater than 0');
      return;
    }

    this.isSubmitting = true;
    this.clearMessages();

    // Call the backend API
    this.http.post('http://localhost:8080/api/rooms/add', this.room)
      .subscribe({
        next: (response) => {
          console.log('Room added successfully:', response);
          this.showSuccess('Room added successfully!');
          this.resetForm();
          this.isSubmitting = false;
          
          // Navigate back to room management after 2 seconds
          setTimeout(() => {
            this.goBack();
          }, 2000);
        },
        error: (error) => {
          console.error('Error adding room:', error);
          this.isSubmitting = false;
          
          if (error.status === 400) {
            this.showError('Invalid room data. Please check your inputs.');
          } else if (error.status === 409) {
            this.showError('Room already exists or conflicts with existing data.');
          } else if (error.status === 500) {
            this.showError('Server error. Please try again later.');
          } else {
            this.showError('Failed to add room. Please try again.');
          }
        }
      });
  }

  resetForm(): void {
    this.room = {
      roomDesc: '',
      roomType: 'Single',
      roomPrice: 0,
      airConditioned: false
    };
  }

  goBack(): void {
    this.router.navigate(['/admin-dashboard/room-management']);
  }

  showSuccess(message: string): void {
    this.successMessage = message;
    this.errorMessage = '';
  }

  showError(message: string): void {
    this.errorMessage = message;
    this.successMessage = '';
  }

  clearMessages(): void {
    this.successMessage = '';
    this.errorMessage = '';
  }
}
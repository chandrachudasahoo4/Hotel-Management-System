import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Room {
  id: number;
  roomDesc: string;
  roomType: string;
  roomPrice: number;
  airConditioned: boolean;
}

@Component({
  selector: 'app-update-room',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './updateRoom.html',
  styleUrls: ['./updateRoom.css']
})
export class UpdateRoomComponent implements OnInit {
  room: Room = {
    id: 0,
    roomDesc: '',
    roomType: 'Single',
    roomPrice: 0,
    airConditioned: false
  };

  roomTypes = ['Single', 'Double', 'Deluxe', 'Suite'];
  isSubmitting = false;
  isLoading = true;
  successMessage = '';
  errorMessage = '';
  roomId: number = 0;

  constructor(
    private router: Router, 
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    // Get room ID from route parameters
    this.route.params.subscribe(params => {
      this.roomId = parseInt(params['id']);
      if (this.roomId) {
        this.loadRoomData();
      } else {
        this.showError('Invalid room ID');
        this.isLoading = false;
      }
    });
  }

  loadRoomData(): void {
    // Load existing room data
    this.http.get<any>(`http://localhost:8080/api/rooms/${this.roomId}`)
      .subscribe({
        next: (response) => {
          if (response.status === 'success' && response.room) {
            this.room = response.room;
            this.isLoading = false;
            console.log('Room data loaded:', response.room);
          } else {
            this.showError(response.message || 'Failed to load room data');
            this.isLoading = false;
          }
        },
        error: (error) => {
          console.error('Error loading room data:', error);
          this.isLoading = false;
          
          if (error.status === 404) {
            this.showError('Room not found');
          } else {
            this.showError('Failed to load room data. Please try again.');
          }
        }
      });
  }

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
    this.http.put(`http://localhost:8080/api/rooms/${this.roomId}/update`, this.room)
      .subscribe({
        next: (response) => {
          console.log('Room updated successfully:', response);
          this.showSuccess('Room updated successfully!');
          this.isSubmitting = false;
          
          // Navigate back to room management after 2 seconds
          setTimeout(() => {
            this.goBack();
          }, 2000);
        },
        error: (error) => {
          console.error('Error updating room:', error);
          this.isSubmitting = false;
          
          if (error.status === 400) {
            this.showError('Invalid room data. Please check your inputs.');
          } else if (error.status === 404) {
            this.showError('Room not found.');
          } else if (error.status === 409) {
            this.showError('Room number already exists. Please use a different room number.');
          } else if (error.status === 500) {
            this.showError('Server error. Please try again later.');
          } else {
            this.showError('Failed to update room. Please try again.');
          }
        }
      });
  }

  resetForm(): void {
    // Reset to original loaded data
    this.loadRoomData();
    this.clearMessages();
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
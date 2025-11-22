import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { SessionHelper } from '../shared/session-helper';

interface Room {
  id: number;
  roomDesc: string;
  roomPrice: number;
  roomType: string;
  airConditioned: boolean;
}

@Component({
  selector: 'app-roomManagement',
  imports: [CommonModule],
  templateUrl: './roomManagement.html',
  styleUrl: './roomManagement.css'
})
export class RoomManagement implements OnInit {
  rooms: Room[] = [];
  loading = true;
  error = '';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.fetchAvailableRooms();
  }
              
  fetchAvailableRooms() {
    this.loading = true;
    const httpOptions = SessionHelper.getHttpOptionsWithCredentials();
    
    this.http.get<any>('http://localhost:8080/api/rooms/available', httpOptions)
      .subscribe({
        next: (response) => {
          console.log('Rooms response:', response);
          
          // Handle both direct array response and wrapped response
          if (Array.isArray(response)) {
            this.rooms = response;
          } else if (response.status === 'success' && response.rooms) {
            this.rooms = response.rooms;
          } else if (response.rooms) {
            this.rooms = response.rooms;
          } else {
            this.error = 'No rooms data found';
          }
          
          this.loading = false;
        },
        error: (err) => {
          console.error('Error fetching rooms:', err);
          this.error = 'Failed to load rooms data';
          this.loading = false;
        }
      });
  }

  refreshRooms(): void {
    this.fetchAvailableRooms();
  }

  goBack(): void {
    this.router.navigate(['/admin-dashboard']);
  }

  formatPrice(price: number): string {
    return `₹${price.toFixed(2)}`;
  }

  addRoom(): void {
    // Navigate to add room component
    this.router.navigate(['/admin-dashboard/add-room']);
  }

  editRoom(room: Room): void {
    // Navigate to update room component with room ID
    this.router.navigate(['/admin-dashboard/update-room', room.id]);
  }

  deleteRoom(room: Room): void {
    // Confirm deletion
    const confirmed = confirm(`Are you sure you want to delete this room?\n\nRoom ID: ${room.id}\nRoom Type: ${room.roomType}\nPrice: ${this.formatPrice(room.roomPrice)}\n\nThis action cannot be undone.`);
    
    if (confirmed) {
      // Call delete API
      this.deleteRoomAPI(room.id);
    }
  }

  deleteRoomAPI(roomId: number): void {
    const httpOptions = SessionHelper.getHttpOptionsWithCredentials();
    
    this.http.delete<any>(`http://localhost:8080/api/rooms/${roomId}/delete`, httpOptions)
      .subscribe({
        next: (response) => {
          console.log('Delete response:', response);
          
          if (response.status === 'success') {
            alert(`Room deleted successfully!\n${response.message}`);
            // Refresh the rooms list to reflect the deletion
            this.fetchAvailableRooms();
          } else {
            alert(`Failed to delete room!\n${response.message}`);
          }
        },
        error: (err) => {
          console.error('Error deleting room:', err);
          
          // Handle specific error responses
          if (err.error && err.error.message) {
            alert(`Error: ${err.error.message}`);
          } else if (err.status === 404) {
            alert('Error: Room not found');
          } else if (err.status === 500) {
            alert('Error: Server error occurred while deleting room');
          } else {
            alert('Error: Failed to delete room. Please try again.');
          }
        }
      });
  }
}
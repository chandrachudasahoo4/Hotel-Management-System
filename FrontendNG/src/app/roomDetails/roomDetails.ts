import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { SessionHelper } from '../shared/session-helper';

interface Room {
  id: number;
  roomDesc: string;
  roomPrice: number;
  roomType: string;
  airConditioned: boolean;
}

@Component({
  selector: 'app-roomDetails',
  imports: [],
  templateUrl: './roomDetails.html',
  styleUrl: './roomDetails.css'
})
export class RoomDetails implements OnInit {
  room: Room | null = null;
  loading = true;
  error = '';
  roomId: number = 0;
  roomImages: string[] = [];

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

    // Get room ID from route
    this.roomId = parseInt(this.route.snapshot.paramMap.get('id') || '0');
    
    if (this.roomId > 0) {
      this.fetchRoomDetails();
    } else {
      this.error = 'Invalid room ID';
      this.loading = false;
    }
  }

  fetchRoomDetails() {
    const httpOptions = SessionHelper.getHttpOptionsWithCredentials();
    
    this.http.get<any>(`http://localhost:8080/api/rooms/${this.roomId}`, httpOptions)
      .subscribe({
        next: (response) => {
          if (response.status === 'success') {
            this.room = response.room;
            this.loadRoomImages(); // Load images after room data is available
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

  loadRoomImages() {
    if (this.room) {
      const roomType = this.room.roomType.toLowerCase();
      this.roomImages = [
        `rooms/${roomType}/1.png`,
        `rooms/${roomType}/2.png`,
        `rooms/${roomType}/3.png`
      ];
    }
  }

  onImageError(event: any, index: number) {
    // Fallback to placeholder if image is not found
    const roomType = this.room?.roomType || 'Unknown';
    event.target.src = `https://via.placeholder.com/400x300/4CAF50/white?text=${roomType}+${index + 1}`;
  }

  bookRoom() {
    this.router.navigate(['/bookRoom', this.roomId]);
  }
}
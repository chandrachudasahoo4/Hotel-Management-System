import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  selector: 'app-listAllRoom',
  imports: [],
  templateUrl: './listAllRoom.html',
  styleUrl: './listAllRoom.css'
})
export class ListAllRoom implements OnInit {
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
    
    this.http.get<Room[]>('http://localhost:8080/api/rooms/available', httpOptions)
      .subscribe({
        next: (data) => {
          this.rooms = data;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error fetching rooms:', err);
          this.error = 'Failed to load available rooms';
          this.loading = false;
        }
      });
  }

  bookRoom(roomId: number) {
    this.router.navigate(['/roomDetails', roomId]);
  }
}
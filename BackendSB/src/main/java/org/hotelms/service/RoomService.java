package org.hotelms.service;

import java.util.*;
import org.hotelms.entity.Room;
import org.hotelms.entity.Booking;
import org.hotelms.repository.RoomRepository;
import org.hotelms.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RoomService {

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private BookingRepository bookingRepository;

    public Map<String, String> addRoom(Room room) {
        Map<String, String> response = new HashMap<>();


        roomRepository.save(room);

        response.put("status", "success");
        response.put("message", "Room added successfully");
        response.put("room_id", String.valueOf(room.getId()));
        return response;
    }

    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }

    public Map<String, Object> getRoomById(int roomId) {
        Map<String, Object> response = new HashMap<>();

        Optional<Room> roomOpt = roomRepository.findById(roomId);

        if (roomOpt.isEmpty()) {
            response.put("status", "error");
            response.put("message", "Room not found");
            return response;
        }

        Room room = roomOpt.get();
        response.put("status", "success");
        response.put("room", room);
        return response;
    }

    public Map<String, String> updateRoom(int roomId, Room updatedRoom) {
        Map<String, String> response = new HashMap<>();

        Optional<Room> roomOpt = roomRepository.findById(roomId);

        if (roomOpt.isEmpty()) {
            response.put("status", "error");
            response.put("message", "Room not found");
            return response;
        }

        Room existingRoom = roomOpt.get();

        if (updatedRoom.getRoomDesc() != null) {
            existingRoom.setRoomDesc(updatedRoom.getRoomDesc());
        }
        if (updatedRoom.getRoomPrice() > 0) {
            existingRoom.setRoomPrice(updatedRoom.getRoomPrice());
        }
        if (updatedRoom.getRoomType() != null) {
            existingRoom.setRoomType(updatedRoom.getRoomType());
        }
        
        existingRoom.setAirConditioned(updatedRoom.isAirConditioned());

        roomRepository.save(existingRoom);

        response.put("status", "success");
        response.put("message", "Room updated successfully");
        return response;
    }

    public Map<String, String> deleteRoom(int roomId) {
        Map<String, String> response = new HashMap<>();

        Optional<Room> roomOpt = roomRepository.findById(roomId);

        if (roomOpt.isEmpty()) {
            response.put("status", "error");
            response.put("message", "Room not found");
            return response;
        }


        List<Booking> roomBookings = bookingRepository.findByRoomId(roomId);
        
        if (!roomBookings.isEmpty()) {
            response.put("status", "error");
            response.put("message", "Cannot delete room. There are " + roomBookings.size() + " booking(s) associated with this room. Please handle the bookings first.");
            return response;
        }

        try {
            roomRepository.deleteById(roomId);
            response.put("status", "success");
            response.put("message", "Room deleted successfully");
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to delete room: " + e.getMessage());
        }

        return response;
    }
    
    public Optional<Room> getRoomEntityById(int roomId) {
        return roomRepository.findById(roomId);
    }
}

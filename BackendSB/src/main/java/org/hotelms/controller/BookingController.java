package org.hotelms.controller;

import java.util.*;

import org.hotelms.entity.Booking;
import org.hotelms.entity.Room;
import org.hotelms.entity.User;
import org.hotelms.service.BookingService;
import org.hotelms.service.RoomService;
import org.hotelms.service.UserService;
import org.hotelms.security.SessionManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestMethod;
import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api")
@CrossOrigin(
        origins = "http://localhost:4200",
        allowCredentials = "true",
        allowedHeaders = "*",
        methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS}
)
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @Autowired
    private RoomService roomService;

    @Autowired
    private UserService userService;

    @Autowired
    private SessionManager sessionManager;

    @PostMapping("/bookings")
    public Map<String, Object> createBooking(@RequestBody Booking booking, HttpSession session) {
        Map<String, Object> res = new HashMap<>();


        if (!sessionManager.isUserLoggedIn(session)) {
            res.put("status", "error");
            res.put("message", "Please login first");
            return res;
        }

        try {

            if (booking.getRoom() == null || booking.getUser() == null) {
                res.put("status", "error");
                res.put("message", "Room and User information are required");
                return res;
            }

            // Get room ID and user ID from the request
            int roomId = booking.getRoom().getId();
            int userId = booking.getUser().getId();

            // Validate room exists
            Optional<Room> roomOpt = roomService.getRoomEntityById(roomId);
            if (roomOpt.isEmpty()) {
                res.put("status", "error");
                res.put("message", "Room not found with ID: " + roomId);
                return res;
            }

            // Validate user exists
            Optional<User> userOpt = userService.getUserById(userId);
            if (userOpt.isEmpty()) {
                res.put("status", "error");
                res.put("message", "User not found with ID: " + userId);
                return res;
            }

            // Set the actual entities
            booking.setRoom(roomOpt.get());
            booking.setUser(userOpt.get());

            if (booking.getCheckinDate() == null || booking.getCheckoutDate() == null) {
                res.put("status", "error");
                res.put("message", "Check-in and Check-out dates are required");
                return res;
            }

            if (booking.getCheckinDate().isAfter(booking.getCheckoutDate())) {
                res.put("status", "error");
                res.put("message", "Check-in date must be before check-out date");
                return res;
            }

            // ✅ CHECK ROOM AVAILABILITY - PREVENT DOUBLE BOOKING
            boolean isAvailable = bookingService.isRoomAvailable(roomId, booking.getCheckinDate(), booking.getCheckoutDate());
            if (!isAvailable) {
                res.put("status", "error");
                res.put("message", "❌ Room is already booked for the selected dates. Please choose different dates or another room.");
                return res;
            }


            Booking savedBooking = bookingService.saveBooking(booking);

            res.put("status", "success");
            res.put("message", "Booking created successfully");
            res.put("booking", savedBooking);
            res.put("confirmationCode", savedBooking.getBookingConfirmationCode());

        } catch (Exception e) {
            System.err.println("Error creating booking: " + e.getMessage());
            e.printStackTrace();
            res.put("status", "error");
            res.put("message", "Failed to create booking: " + e.getMessage());
        }

        return res;
    }

    @GetMapping("/bookings/history")
    public Map<String, Object> getBookingHistory() {
        Map<String, Object> res = new HashMap<>();

        try {
            List<Booking> bookings = bookingService.getAllBookings();


            List<Map<String, Object>> simpleBookings = new ArrayList<>();
            
            for (Booking booking : bookings) {
                Map<String, Object> bookingData = new HashMap<>();
                bookingData.put("id", booking.getId());
                bookingData.put("bookingConfirmationCode", booking.getBookingConfirmationCode());
                bookingData.put("checkinDate", booking.getCheckinDate());
                bookingData.put("checkoutDate", booking.getCheckoutDate());
                bookingData.put("numOfChildren", booking.getNumOfChildren());
                bookingData.put("totalNumOfGuest", booking.getTotalNumOfGuest());
                bookingData.put("totalFee", booking.getTotalFee());
                bookingData.put("status", booking.getStatus());
                

                if (booking.getRoom() != null) {
                    bookingData.put("roomId", booking.getRoom().getId());
                }
                if (booking.getUser() != null) {
                    bookingData.put("userId", booking.getUser().getId());
                }
                
                simpleBookings.add(bookingData);
            }
            
            res.put("status", "success");
            res.put("message", "Booking history fetched successfully");
            res.put("totalCount", simpleBookings.size());
            res.put("bookings", simpleBookings);
        } catch (Exception e) {
            res.put("status", "error");
            res.put("message", "Failed to fetch booking history: " + e.getMessage());
            e.printStackTrace();
        }

        return res;
    }

    @GetMapping("/bookings/by-user/{userId}")
    public Map<String, Object> getBookingsByUserIdSimple(@PathVariable Integer userId) {
        Map<String, Object> res = new HashMap<>();

        try {
            List<Booking> bookings = bookingService.getBookingsByUserId(userId);
            

            List<Map<String, Object>> simpleBookings = new ArrayList<>();
            
            for (Booking booking : bookings) {
                Map<String, Object> bookingData = new HashMap<>();
                bookingData.put("id", booking.getId());
                bookingData.put("bookingConfirmationCode", booking.getBookingConfirmationCode());
                bookingData.put("checkinDate", booking.getCheckinDate());
                bookingData.put("checkoutDate", booking.getCheckoutDate());
                bookingData.put("numOfChildren", booking.getNumOfChildren());
                bookingData.put("totalNumOfGuest", booking.getTotalNumOfGuest());
                bookingData.put("totalFee", booking.getTotalFee());
                bookingData.put("status", booking.getStatus());
                
                // Add room and user IDs
                if (booking.getRoom() != null) {
                    bookingData.put("roomId", booking.getRoom().getId());
                }
                if (booking.getUser() != null) {
                    bookingData.put("userId", booking.getUser().getId());
                }
                
                simpleBookings.add(bookingData);
            }
            
            res.put("status", "success");
            res.put("message", "Bookings for user ID " + userId + " fetched successfully");
            res.put("userId", userId);
            res.put("totalCount", simpleBookings.size());
            res.put("bookings", simpleBookings);
        } catch (Exception e) {
            res.put("status", "error");
            res.put("message", "Failed to fetch bookings for user: " + e.getMessage());
            e.printStackTrace();
        }

        return res;
    }

    @PutMapping("/bookings/{id}/complete")
    public Map<String, String> completeBooking(@PathVariable Integer id) {
        Map<String, String> res = new HashMap<>();

        try {
            // Get booking to verify it exists
            Optional<Booking> bookingOpt = bookingService.getBookingById(id);
            if (bookingOpt.isEmpty()) {
                res.put("status", "error");
                res.put("message", "Booking not found with ID: " + id);
                return res;
            }

            Booking booking = bookingOpt.get();
            

            booking.setStatus("COMPLETED");
            bookingService.saveBooking(booking);
            
            res.put("status", "success");
            res.put("message", "Booking completed successfully");
            res.put("bookingId", id.toString());
            res.put("newStatus", "COMPLETED");

        } catch (Exception e) {
            res.put("status", "error");
            res.put("message", "Failed to complete booking: " + e.getMessage());
            e.printStackTrace();
        }

        return res;
    }

    @PutMapping("/bookings/{id}/cancel")
    public Map<String, String> cancelBookingSimple(@PathVariable Integer id) {
        Map<String, String> res = new HashMap<>();

        try {
            // Get booking to verify it exists
            Optional<Booking> bookingOpt = bookingService.getBookingById(id);
            if (bookingOpt.isEmpty()) {
                res.put("status", "error");
                res.put("message", "Booking not found with ID: " + id);
                return res;
            }

            Booking booking = bookingOpt.get();
            
            booking.setStatus("CANCELLED");
            bookingService.saveBooking(booking);
            
            res.put("status", "success");
            res.put("message", "Booking cancelled successfully");
            res.put("bookingId", id.toString());
            res.put("newStatus", "CANCELLED");

        } catch (Exception e) {
            res.put("status", "error");
            res.put("message", "Failed to cancel booking: " + e.getMessage());
            e.printStackTrace();
        }

        return res;
    }


    @GetMapping("/bookings/conflicts")
    public Map<String, Object> getBookingConflicts() {
        Map<String, Object> res = new HashMap<>();

        try {
            List<Booking> allBookings = bookingService.getAllBookings();
            List<Map<String, Object>> conflicts = new ArrayList<>();
            

            for (int i = 0; i < allBookings.size(); i++) {
                Booking booking1 = allBookings.get(i);
                

                if ("CANCELLED".equals(booking1.getStatus())) {
                    continue;
                }
                
                for (int j = i + 1; j < allBookings.size(); j++) {
                    Booking booking2 = allBookings.get(j);
                    

                    if ("CANCELLED".equals(booking2.getStatus())) {
                        continue;
                    }
                    

                    if (booking1.getRoom().getId() == booking2.getRoom().getId() &&
                        booking1.getCheckinDate().isBefore(booking2.getCheckoutDate()) &&
                        booking1.getCheckoutDate().isAfter(booking2.getCheckinDate())) {
                        
                        Map<String, Object> conflict = new HashMap<>();
                        conflict.put("booking1Id", booking1.getId());
                        conflict.put("booking2Id", booking2.getId());
                        conflict.put("roomId", booking1.getRoom().getId());
                        conflict.put("booking1Dates", booking1.getCheckinDate() + " to " + booking1.getCheckoutDate());
                        conflict.put("booking2Dates", booking2.getCheckinDate() + " to " + booking2.getCheckoutDate());
                        conflict.put("booking1Code", booking1.getBookingConfirmationCode());
                        conflict.put("booking2Code", booking2.getBookingConfirmationCode());
                        conflicts.add(conflict);
                    }
                }
            }
            
            res.put("status", "success");
            res.put("message", "Booking conflicts check completed");
            res.put("conflictCount", conflicts.size());
            res.put("conflicts", conflicts);
            
        } catch (Exception e) {
            res.put("status", "error");
            res.put("message", "Failed to check booking conflicts: " + e.getMessage());
            e.printStackTrace();
        }

        return res;
    }


    @GetMapping("/bookings/check-availability")
    public Map<String, Object> checkRoomAvailability(@RequestParam Integer roomId,
                                                    @RequestParam String checkinDate,
                                                    @RequestParam String checkoutDate) {
        Map<String, Object> res = new HashMap<>();

        try {
            java.time.LocalDate checkin = java.time.LocalDate.parse(checkinDate);
            java.time.LocalDate checkout = java.time.LocalDate.parse(checkoutDate);
            
            boolean isAvailable = bookingService.isRoomAvailable(roomId, checkin, checkout);
            List<Booking> overlappingBookings = bookingService.getOverlappingBookings(roomId, checkin, checkout);
            
            res.put("status", "success");
            res.put("roomId", roomId);
            res.put("checkinDate", checkinDate);
            res.put("checkoutDate", checkoutDate);
            res.put("isAvailable", isAvailable);
            res.put("overlappingBookingsCount", overlappingBookings.size());
            
            if (!isAvailable) {
                res.put("message", "Room is not available for the selected dates");
            } else {
                res.put("message", "Room is available for the selected dates");
            }
            
        } catch (Exception e) {
            res.put("status", "error");
            res.put("message", "Failed to check room availability: " + e.getMessage());
            e.printStackTrace();
        }

        return res;
    }
}

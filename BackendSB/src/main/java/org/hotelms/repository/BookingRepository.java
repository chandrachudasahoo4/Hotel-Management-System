package org.hotelms.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.hotelms.entity.Booking;
import java.time.LocalDate;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Integer> {
    
    @Query("SELECT b FROM Booking b JOIN FETCH b.room JOIN FETCH b.user WHERE b.user.id = :userId")
    List<Booking> findByUserId(@Param("userId") Integer userId);
    
    @Query("SELECT b FROM Booking b WHERE b.room.id = :roomId")
    List<Booking> findByRoomId(@Param("roomId") Integer roomId);
    

    @Query("SELECT b FROM Booking b WHERE b.room.id = :roomId " +
           "AND b.status != 'CANCELLED' " +
           "AND b.checkinDate < :checkoutDate " +
           "AND b.checkoutDate > :checkinDate")
    List<Booking> findOverlappingBookings(@Param("roomId") Integer roomId, 
                                        @Param("checkinDate") LocalDate checkinDate, 
                                        @Param("checkoutDate") LocalDate checkoutDate);
}

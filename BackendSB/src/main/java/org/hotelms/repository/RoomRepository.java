package org.hotelms.repository;

import java.util.List;
import org.hotelms.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface RoomRepository extends JpaRepository<Room, Integer> {


    List<Room> findByRoomType(String roomType);


    List<Room> findByRoomPriceBetween(double minPrice, double maxPrice);


    List<Room> findByAirConditioned(boolean airConditioned);


    @Query("SELECT r FROM Room r WHERE r.roomType = :roomType AND r.airConditioned = :airConditioned")
    List<Room> findByRoomTypeAndAirConditioned(
            @Param("roomType") String roomType,
            @Param("airConditioned") boolean airConditioned
    );
}

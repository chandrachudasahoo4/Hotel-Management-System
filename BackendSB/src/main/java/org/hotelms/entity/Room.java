package org.hotelms.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "rooms")
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "room_desc", length = 500)
    private String roomDesc;

    @Column(name = "room_price", nullable = false)
    private double roomPrice;

    @Column(name = "room_type", nullable = false, length = 50)
    private String roomType;

    @Column(name = "has_ac", nullable = false)
    private boolean airConditioned;

    // Default constructor
    public Room() {}

    // Constructor with parameters
    public Room(String roomDesc, double roomPrice, String roomType, boolean airConditioned) {
        this.roomDesc = roomDesc;
        this.roomPrice = roomPrice;
        this.roomType = roomType;
        this.airConditioned = airConditioned;
    }

    // Getters and Setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getRoomDesc() {
        return roomDesc;
    }

    public void setRoomDesc(String roomDesc) {
        this.roomDesc = roomDesc;
    }

    public double getRoomPrice() {
        return roomPrice;
    }

    public void setRoomPrice(double roomPrice) {
        this.roomPrice = roomPrice;
    }

    public String getRoomType() {
        return roomType;
    }

    public void setRoomType(String roomType) {
        this.roomType = roomType;
    }

    public boolean isAirConditioned() {
        return airConditioned;
    }

    public void setAirConditioned(boolean airConditioned) {
        this.airConditioned = airConditioned;
    }

    @Override
    public String toString() {
        return "Room{" +
                "id=" + id +
                ", roomDesc='" + roomDesc + '\'' +
                ", roomPrice=" + roomPrice +
                ", roomType='" + roomType + '\'' +
                ", airConditioned=" + airConditioned +
                '}';
    }
}

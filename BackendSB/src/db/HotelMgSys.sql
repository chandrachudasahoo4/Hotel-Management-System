create database HotelManagementSystem;
use HotelManagementSystem;

-- Create the merged users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone_number VARCHAR(15),
    role VARCHAR(20) NOT NULL
);

-- Create the simplified rooms table
CREATE TABLE rooms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    room_desc VARCHAR(500),
    room_price DOUBLE NOT NULL,
    room_type VARCHAR(50) NOT NULL,
    has_ac BOOLEAN NOT NULL DEFAULT false
);

-- Insert sample data for users
INSERT INTO users (email, name, password, phone_number, role)
VALUES
('admin@gmail.com', 'Admin User', '1111qqqqQ', '1234567890', 'ADMIN'),
('r@r.com', 'Reception User', '1111qqqqQ', '3456789012', 'RECEPTION'),
('arjun@gmail.com', 'Customer User', '1111qqqqQ', '4567890123', 'CUSTOMER');

-- Create the new booking table
CREATE TABLE booking (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_confirmation_code VARCHAR(4) NOT NULL,
    checkin_date DATE NOT NULL,
    checkout_date DATE NOT NULL,
    num_of_children INT NOT NULL,
    total_num_of_guest INT NOT NULL,
    room_id INT NOT NULL,
    user_id INT NOT NULL,
    total_fee DOUBLE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    CONSTRAINT fk_booking_room FOREIGN KEY (room_id) REFERENCES rooms(id),
    CONSTRAINT fk_booking_user FOREIGN KEY (user_id) REFERENCES users(id)
);

INSERT INTO users (email, name, password, phone_number, role)
VALUES
    ('admin@gmail.com', 'Admin User', '1111qqqqQ', '1234567890', 'ADMIN'),
    ('r@r.com', 'Reception User', '1111qqqqQ', '3456789012', 'RECEPTION'),
    ('arjun@gmail.com', 'Customer User', '1111qqqqQ', '4567890123', 'CUSTOMER');


-- Insert sample data for rooms
INSERT INTO rooms (room_desc, room_price, room_type, has_ac)
VALUES
('Cozy single room with garden view, perfect for solo travelers', 99.99, 'Single', true),
('Comfortable double room with city view and modern amenities', 149.99, 'Double', true),
('Luxury suite with ocean view, spacious living area and premium amenities', 299.99, 'Suite', true),
('Beautiful double room with mountain view and essential facilities', 169.99, 'Double', true),
('Budget-friendly single room with basic amenities', 89.99, 'Single', false),
('Premium suite with panoramic view and luxury furnishings', 349.99, 'Suite', true),
('Standard double room with city view', 129.99, 'Double', false),
('Deluxe single room with balcony', 119.99, 'Single', true);

-- Insert sample booking data for testing
INSERT INTO booking (booking_confirmation_code, checkin_date, checkout_date, num_of_children, total_num_of_guest, room_id, user_id, total_fee, status)
VALUES
('1234', '2025-11-05', '2025-11-07', 0, 1, 1, 3, 199.98, 'PENDING'),
('5678', '2025-11-10', '2025-11-12', 1, 3, 2, 3, 299.98, 'COMPLETED'),
('9012', '2025-11-15', '2025-11-17', 0, 2, 4, 3, 339.98, 'CANCELLED');

-- Show tables and data
show tables;

select * from users;
describe users;

select * from rooms;
describe rooms;
-- drop table rooms;

select * from booking;
describe booking;
-- drop table booking;
-- TRUNCATE TABLE `booking`;


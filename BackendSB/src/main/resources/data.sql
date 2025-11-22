-- Insert sample users
INSERT INTO users (email, name, password, phone_number, role) VALUES
('admin@a.com', 'Admin User', '123', '1234567890', 'ADMIN'),
('r@r.com', 'Reception User', '123', '3456789012', 'RECEPTION'),
('customer@c.com', 'Customer User', '123', '4567890123', 'CUSTOMER');

-- Insert sample rooms
INSERT INTO rooms (room_desc, room_price, room_type, has_ac) VALUES
('Cozy single room with garden view, perfect for solo travelers', 99.99, 'Single', true),
('Comfortable double room with city view and modern amenities', 149.99, 'Double', true),
('Luxury suite with ocean view, spacious living area and premium amenities', 299.99, 'Suite', true),
('Beautiful double room with mountain view and essential facilities', 169.99, 'Double', true),
('Budget-friendly single room with basic amenities', 89.99, 'Single', false),
('Premium suite with panoramic view and luxury furnishings', 349.99, 'Suite', true),
('Standard double room with city view', 129.99, 'Double', false),
('Deluxe single room with balcony', 119.99, 'Single', true);

-- Insert sample booking data for customer@c.com (user_id = 3)
INSERT INTO booking (booking_confirmation_code, checkin_date, checkout_date, num_of_children, total_num_of_guest, room_id, user_id, total_fee, status) VALUES
('1234', '2025-11-05', '2025-11-07', 0, 1, 1, 3, 199.98, 'PENDING'),
('5678', '2025-11-10', '2025-11-12', 1, 3, 2, 3, 299.98, 'COMPLETED'),
('9012', '2025-11-15', '2025-11-17', 0, 2, 4, 3, 339.98, 'CANCELLED'),
('3456', '2025-12-01', '2025-12-03', 0, 2, 3, 3, 599.98, 'PENDING');
# 🏨 Hotel Management System - Backend

A comprehensive Hotel Management System backend built with Spring Boot, providing RESTful APIs for managing hotel operations including room bookings, customer management, and administrative functions.

## 📋 About The Project

This is the backend component of a full-stack Hotel Management System that enables hotels to efficiently manage their daily operations. The system handles user authentication, room management, booking processes, and provides a robust API layer for the Angular frontend.

### Built With

- **Java** - Primary programming language
- **Spring Boot** - Application framework
- **Spring Data JPA** - Database operations and ORM
- **Spring Security** - Authentication and authorization
- **MySQL** - Relational database
- **Maven** - Dependency management and build tool

## 🚀 Features

- **User Management**: Registration, login, and profile management with role-based access control
- **Authentication**: Secure JWT-based authentication system
- **Room Management**: CRUD operations for hotel rooms and availability tracking
- **Booking System**: Handle customer reservations, check-in, and check-out processes
- **RESTful APIs**: Well-structured endpoints for Angular frontend integration
- **Database Integration**: MySQL connectivity with JPA for seamless data persistence

## 📁 Project Structure

src/
├── main/
│ ├── java/
│ │ └── org.hotelms/
│ │ ├── controller/ # REST API endpoints
│ │ │ ├── LoginController.java
│ │ │ └── UserController.java
│ │ ├── entity/ # JPA entities (database models)
│ │ ├── repository/ # Database access layer
│ │ │ └── UserRepository.java
│ │ └── service/ # Business logic layer
│ └── resources/
│ └── application.properties # Configuration file
└── test/ # Unit and integration tests


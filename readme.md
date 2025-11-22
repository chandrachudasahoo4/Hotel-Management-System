# Hotel Management System

A full-stack hotel management application built with Spring Boot backend and Angular frontend, providing comprehensive hotel operations management including room bookings, customer management, and administrative functions.

## 📋 Overview

This project is a complete Hotel Management System designed to streamline hotel operations. It features a RESTful API backend with session-based authentication and a responsive Angular frontend for managing rooms, bookings, customers, and staff.

## ✨ Features

- **User Authentication**: Secure session-based authentication with role-based access control (Admin, Staff, Guest)
- **Room Management**: Add, update, delete, and view room information
- **Booking Management**: Handle check-ins, check-outs, and reservations
- **Customer Management**: Manage customer information and profiles
- **Staff Management**: Administrative tools for staff oversight
- **Billing System**: Generate invoices and manage payments
- **Dashboard**: Analytics and statistics visualization
- **Responsive Design**: Mobile and desktop-friendly interface

## 🛠️ Technology Stack

### Backend

- **Java** with **Spring Boot**
- **MySQL** database
- **REST API** architecture
- Session-based authentication with HttpSession
- Role-based authorization

### Frontend

- **AngularJS** (Angular)
- **TypeScript**
- **CSS** for styling
- HTTP client for API integration

## 📁 Project Structure

```
ProductDevelopment/
├── Backend/                    # Spring Boot backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── org.hotelms/
│   │   │   │       ├── controller/    # REST API endpoints
│   │   │   │       ├── entity/        # JPA entities
│   │   │   │       ├── repository/    # Data access layer
│   │   │   │       └── service/       # Business logic
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/
│   ├── IMPLEMENTATION_STATUS.md
│   └── SESSION_GUIDE.md
│
└── Frontend/                   # Angular frontend
    ├── src/
    │   ├── app/
    │   │   ├── admin-dashboard/
    │   │   ├── login/
    │   │   ├── register/
    │   │   ├── roomManagement/
    │   │   ├── addRoom/
    │   │   ├── about/
    │   │   └── shared/
    │   └── assets/
    └── angular.json
```

## 🚀 Getting Started

### Prerequisites

- **Java 17** or higher
- **Node.js** and **npm**
- **MySQL** database server
- **Angular CLI** (`npm install -g @angular/cli`)

### Backend Setup

1. Navigate to the Backend directory:

```bash
cd Backend
```

2. Configure MySQL connection in `application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/hotel_db
spring.datasource.username=your_username
spring.datasource.password=your_password
```

3. Run the Spring Boot application:

```bash
./mvnw spring-boot:run
```

The backend API will be available at `http://localhost:8080`

### Frontend Setup

1. Navigate to the Frontend directory:

```bash
cd Frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
ng serve
```

The application will be available at `http://localhost:4200`

## 🔐 Authentication

The system uses **session-based authentication** with the following features:

- Session timeout after 30 minutes of inactivity
- Role-based access control
- Server-side session validation
- Secure cookie management

### Test Login

- **Email**: `admin@a.com`
- **Password**: `123`

For detailed authentication implementation, see [`Backend/SESSION_GUIDE.md`](Backend/SESSION_GUIDE.md)

## 📚 API Documentation

### Authentication Endpoints

- `POST /api/register` - Register new user
- `POST /api/login` - User login
- `GET /api/logout` - User logout

### Protected Endpoints

- `GET /api/allUsers` - Get all users (Admin only)
- Room management endpoints
- Booking management endpoints

## 🔒 Security Features

- Session-based authentication with HttpSession
- Role-based authorization (Admin, Staff, Guest)
- Password validation with strength requirements
- Email validation
- CORS configuration for frontend-backend communication

## 🌟 Key Components

### Backend Controllers

- **LoginController**: Handles authentication
- **UserController**: Manages user operations

### Frontend Components

- **Login**: User authentication interface
- **Register**: New user registration
- **Admin Dashboard**: Administrative overview
- **Room Management**: Room CRUD operations
- **Add Room**: Create new room entries

## 📝 Documentation

- **SESSION_GUIDE.md** - Complete guide to session authentication system
- **IMPLEMENTATION_STATUS.md** - Current implementation status and features

## 🎯 Future Enhancements

- Advanced reporting and analytics
- Email notifications for bookings
- Payment gateway integration
- Multi-language support
- Enhanced dashboard with real-time data

## 📄 License

This project is open source and available for educational purposes.

## 👤 Author

**Chandrachuda Sahoo**

- GitHub: [@chandrachudasahoo4](https://github.com/chandrachudasahoo4)


# Hotel Management System (Front-End)

This is the **Angular front-end** application for a Hotel Management System. It provides a user-friendly interface for managing hotel operations such as room bookings, customer management, staff management, and reporting.



## Table of Contents

* [Features](#features)
* [Demo](#demo)
* [Technologies Used](#technologies-used)
* [Project Structure](#project-structure)
* [Installation](#installation)
* [Usage](#usage)
* [Future Enhancements](#future-enhancements)
<!-- * [Contributing](#contributing) -->
* [License](#license)



## Features

* User authentication and authorization (Admin, Staff, Guest)
* Room management (Add, Update, Delete, View)
* Booking management (Check-in, Check-out, Reservation)
* Customer management (Add, Update, Delete, View)
* Staff management (Add, Update, Delete, View)
* Billing and invoice generation
* Dashboard with charts and statistics
* Responsive design for mobile and desktop



## Demo

*(N/A)*



## Technologies Used

* **Framework:** Angular 17+
* **Language:** TypeScript, HTML, CSS
* **UI Library:** Angular Material
* **Routing:** Angular Router
* **HTTP Client:** Angular HttpClient for API integration
* **Forms:** Reactive Forms and Template-Driven Forms



## Project Structure

```
hotel-management-frontend/
│
├── src/
│   ├── app/
│   │   ├── components/      # Reusable components (header, footer, sidebar)
│   │   ├── pages/           # Feature pages (dashboard, rooms, bookings)
│   │   ├── services/        # Angular services for API calls
│   │   ├── models/          # TypeScript models/interfaces
│   │   ├── guards/          # Route guards
│   │   ├── app-routing.module.ts
│   │   └── app.module.ts
│   └── assets/              # Images, styles, icons
├── angular.json
├── package.json
└── README.md
```



## Installation

1. Clone the repository:

```bash
git clone https://github.com/SubhamSathua/Hotel-Management-System-Frontend.git
cd hotel-management-frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
ng serve
```

4. Open your browser at `http://localhost:4200/`



## Usage

* Navigate through the dashboard to manage rooms, bookings, staff, and customers.
* Use the booking module to create, update, and delete reservations.
* Admin users can manage staff and view analytics.



## Future Enhancements

* Integration with back-end APIs for real-time data
* Payment gateway integration
* Advanced analytics and reporting
* Multi-language support
* Push notifications for booking reminders



<!-- ## Contributing

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "Add new feature"`
4. Push to the branch: `git push origin feature/your-feature`
5. Create a pull request -->



## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

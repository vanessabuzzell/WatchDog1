# WatchDog

[Repo](https://github.com/vanessabuzzell/WatchDog1)

[Project Planning Document](https://docs.google.com/document/d/1T0gbiML-7wfC0YgNWw6-VNhHxqkhJ2PDRvlwmrr9VmQ/edit?usp=sharing)

## Web Service

Deployed Render URL: https://watchdog-7ja8.onrender.com
Deployed Render Docs: https://watchdog-7ja8.onrender.com/api-docs

# WatchDog API

A comprehensive web service API for dog care service management, connecting pet owners with professional caregivers and facilitating appointment scheduling.

## Overview

WatchDog is a RESTful API that enables dog care businesses to manage their operations efficiently. The service provides endpoints for managing clients, caregivers, services, and appointments, with secure authentication and comprehensive documentation.

## Features

- **Client Management**: Register and manage pet owners and their dogs
- **Caregiver Management**: Manage dog care service providers and their profiles
- **Service Management**: Define and manage different types of dog care treatments
- **Appointment Scheduling**: Book and manage appointments between clients and caregivers
- **Secure Authentication**: OAuth 2.0 implementation using Auth0
- **API Documentation**: Interactive Swagger documentation
- **Comprehensive Testing**: Full test suite for all endpoints

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **ODM**: Mongoose
- **Authentication**: Auth0 (OAuth 2.0)
- **Testing**: Jest
- **Documentation**: Swagger/OpenAPI
- **Language**: JavaScript
- **Hosting**: Render

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

## Installation

1. Clone the repository:

```bash
git clone https://github.com/vanessabuzzell/WatchDog1.git
cd WatchDog1
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env
```

4. Configure your `.env` file with the following variables:

```env
# Server Configuration
PORT=3000
NODE_ENV=dev

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/watchdog

# Auth0 Configuration
AUTH0_DOMAIN=your-auth0-domain.auth0.com
AUTH0_CLIENT_ID=your-client-id
AUTH0_CLIENT_SECRET=your-client-secret
AUTH0_AUDIENCE=your-api-identifier

# JWT Configuration
JWT_SECRET=your-jwt-secret
```

## Getting Started

1. Run the development server:

```bash
npm run dev
```

2. The API will be available at `http://localhost:8080/`

3. Access the Swagger documentation at `http://localhost:8080//api-docs`

## API Endpoints

### Authentication

All endpoints require authentication via Auth0 JWT tokens.

### Clients

- `GET /api/clients` - Get all clients
- `POST /api/clients` - Create a new client
- `GET /api/clients/:id` - Get client by ID
- `PUT /api/clients/:id` - Update client
- `DELETE /api/clients/:id` - Delete client

### Caregivers

- `GET /api/caregivers` - Get all caregivers
- `POST /api/caregivers` - Create a new caregiver
- `GET /api/caregivers/:id` - Get caregiver by ID
- `PUT /api/caregivers/:id` - Update caregiver
- `DELETE /api/caregivers/:id` - Delete caregiver

### Services

- `GET /api/services` - Get all services
- `POST /api/services` - Create a new service
- `GET /api/services/:id` - Get service by ID
- `PUT /api/services/:id` - Update service
- `DELETE /api/services/:id` - Delete service

### Appointments

- `GET /api/appointments` - Get all appointments
- `POST /api/appointments` - Create a new appointment
- `GET /api/appointments/:id` - Get appointment by ID
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Delete appointment

## Database Schema

### Client Schema

```javascript
{
  name: String,
  email: String,
  phone: String,
  address: String,
  dogs: [{
    name: String,
    breed: String,
    age: Number,
    specialNotes: String
  }],
  createdAt: Date,
  updatedAt: Date
}
```

### Caregiver Schema

```javascript
{
  name: String,
  email: String,
  phone: String,
  specialties: [String],
  experience: String,
  rating: Number,
  availability: [String],
  createdAt: Date,
  updatedAt: Date
}
```

### Service Schema

```javascript
{
  name: String,
  description: String,
  duration: Number,
  price: Number,
  category: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Appointment Schema

```javascript
{
  client: ObjectId,
  caregiver: ObjectId,
  service: ObjectId,
  date: Date,
  status: String,
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

## Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run test suite
- `npm run swagger` - Swagger document autogenerator

## Authentication

This API uses Auth0 for authentication. To access protected endpoints:

1. Obtain an access token from Auth0
2. Include the token in the Authorization header:

```
Authorization: Bearer <your-access-token>
```

## Error Handling

The API uses standard HTTP status codes and returns errors in the following format:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": "Additional error details (optional)"
  }
}
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

Project Link: https://github.com/vanessabuzzell/WatchDog1

## Acknowledgments

- Auth0 for authentication services
- MongoDB for database solutions
- Express.js community for excellent documentation
- Jest for testing framework

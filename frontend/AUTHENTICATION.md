# GreenShift Authentication System

Welcome to GreenShift! This document contains demo user accounts for testing the authentication system.

## Demo User Accounts

### Individual User
- **Email:** rahul@example.com  
- **Password:** password123
- **Type:** Individual
- **Features:** All modules (Green Commute, City Safety, My Impact, Recycle Hub)

### Hostel/PG Account
- **Email:** priya@studentspg.com  
- **Password:** hostel123
- **Type:** Hostel/PG
- **Organization:** Students Paradise PG
- **Features:** All modules + bulk donation features

### Company Account
- **Email:** amit@techcorp.com  
- **Password:** company123
- **Type:** Company
- **Organization:** TechCorp Solutions
- **Features:** All modules + corporate sustainability tracking

### Vendor/NGO Account
- **Email:** sneha@ecorecycle.org  
- **Password:** vendor123
- **Type:** Vendor/NGO
- **Organization:** EcoRecycle Bengaluru
- **Features:** All modules + vendor dashboard (recycle requests management)

### Admin Account
- **Email:** admin@greenshift.com  
- **Password:** admin123
- **Type:** Individual (with admin privileges)
- **Features:** Full access to all modules and admin features

## User Types & Features

### Individual
- Track personal sustainability impact
- Use public transportation features
- Request recycling pickups
- Earn and redeem eco-points

### Hostel/PG
- All individual features
- Bulk food donation capabilities
- Group sustainability tracking
- Special hostel-specific pickup options

### Company
- All individual features
- Corporate sustainability reporting
- Employee engagement features
- Bulk recycling requests

### Vendor/NGO
- All individual features
- Access to vendor dashboard
- Manage incoming recycling requests
- View and accept/reject pickup requests
- Special vendor-only features

## Getting Started

1. Navigate to the registration page at `/auth/register`
2. Choose your account type
3. Fill in the required information
4. Sign in using the demo credentials above
5. Explore the different modules based on your user type

## API Endpoints

- **POST /api/users/register** - User registration
- **POST /api/users/login** - User login
- All endpoints support the 4 user types with appropriate validation

## Features by Module

### Green Commute (All Users)
- Bus tracking and crowd monitoring
- Real-time transportation updates
- Eco-friendly commute tracking

### City Safety (All Users)
- AI-powered crowd analysis
- Event monitoring and alerts
- Safety reporting features

### My Impact (All Users)
- Daily sustainability logging
- Carbon footprint tracking
- Personal impact metrics

### Recycle Hub
- **Individual/Hostel/Company:** Request pickups, earn points
- **Vendor/NGO:** Manage requests, accept/reject pickups via dashboard

## Security Features

- JWT token-based authentication
- localStorage session management
- Protected routes for authenticated users
- Role-based access control for vendor features
- Secure password validation and user type verification

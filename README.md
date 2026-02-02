# FurniLink by COURTS Malaysia

A premium ecommerce web application built with Angular.

## Features
- **Frontend Only**: Mock data services used (no backend required).
- **Branding**: "FurniLink by COURTS Malaysia" with premium aesthetics.
- **Customer Features**: Browse, Search, Product Details, Reviews, PayPal Sandbox (Simulation), Order History, PDF Receipt.
- **Admin Features**: Dashboard, Product Management (CRUD), Sales Reports.
- **Geolocation**: Find nearest COURTS shops with distance calculation.

## Tech Stack
- Angular 19+ (Standalone Components)
- Bootstrap 5 (Styling)
- jsPDF (Receipt Generation)
- Bootstrap Icons

## Setup & Run

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Development Server**:
   ```bash
   ng serve
   ```
   Navigate to `http://localhost:4200/`.

## Demo Credentials

- **Admin User**:
  - Email: `admin@courts.com`
  - Password: `password`

- **Customer User**:
  - Email: `user@example.com`
  - Password: `password`
  - *Or register a new account.*

## Project Structure
- `src/app/services`: Mock data services (Auth, Product, Order, Shop).
- `src/app/pages`: Page components (Home, Details, Payment, Admin, etc.).
- `src/app/components`: Shared components (Navbar, Footer).
- `src/styles.css`: Custom premium branding variables and styles.

# E-Commerce

## Description

E-Commerce is a full-stack e-commerce application built with Next.js. The project includes a product catalog, shopping cart, favorites system, user authentication, internationalization (i18n), MongoDB integration, and an automated email system powered by cron jobs.

The application follows a layered architecture that separates business logic, database access, API routes, and UI components, making the codebase easier to maintain and scale.

---

## Project Structure

```text
src/
├── app/
│   ├── api/
│   ├── dashboard/
│   ├── layout.tsx
│   └── page.tsx
│
├── components/
│
├── lib/
│   ├── auth.ts
│   ├── cron.ts
│   ├── mongodb.ts
│   ├── require-auth.ts
│   └── validations.ts
│
├── models/
│   ├── Cart.ts
│   ├── Favorite.ts
│   ├── Product.ts
│   ├── Sale.ts
│   └── User.ts
│
├── services/
│   ├── cart.service.ts
│   ├── favorite.service.ts
│   ├── mail.service.ts
│   ├── product.service.ts
│   ├── sale.service.ts
│   └── user.service.ts
│
└── types/
```
---

## Features

### Product Catalog

* Browse available products from MongoDB.
* Server-side data handling using Next.js.
* Structured product models and service layer architecture.

### Shopping Cart & Favorites

* Add and remove products from the shopping cart.
* Save products to a favorites list.
* Separate services for cart and favorites management.

### Authentication

* User registration and login.
* JWT-based authentication.
* Protected routes using custom authentication utilities.

### Internationalization (i18n)

* Multi-language support.
* Language-aware user experience across the application.

### Automated Email System

* Scheduled email delivery using cron jobs.
* Reads users directly from the database and sends automated emails.
* Includes a strict global interface lock inside `mongodb.ts` to prevent duplicate cronjob execution during Next.js hot reloads and development server restarts.
* Centralized email handling through the mail service layer.

### Database Integration

* MongoDB with Mongoose models.
* Dedicated models for:

  * Cart
  * Favorite
  * Product
  * Sale
  * User

### Service Layer Architecture

* Business logic is separated from API routes.
* Dedicated services for products, users, sales, cart management, favorites, and email operations.
* Improves maintainability and scalability.

---

## Environment Variables

```env
MONGODB_URI=
JWT_SECRET=
JWT_REFRESH_SECRET=
EMAIL_USER=
EMAIL_PASS=
```

---

## How to Run

### 1. Clone the repository

```bash
git clone <repository-url>
cd simulacro-ecommerce
```

### 2. Install dependencies

```bash
bun install
```

### 3. Configure environment variables

Create a `.env` file in the project root and add the required variables:

```env
MONGODB_URI=
JWT_SECRET=
JWT_REFRESH_SECRET=
EMAIL_USER=
EMAIL_PASS=
```

### 4. Start the development server

```bash
bun dev
```

The application will be available at:

```text
http://localhost:3000
```

---

## Tech Stack

* Next.js
* React
* TypeScript
* MongoDB
* Mongoose
* JWT Authentication
* Bun
* Cron Jobs
* Nodemailer
* i18n

---

## Architecture Overview

The project follows a layered architecture:

```text
UI Components
      │
      ▼
API Routes
      │
      ▼
Services
      │
      ▼
Mongoose Models
      │
      ▼
MongoDB
```

This separation helps keep controllers lightweight, business logic centralized, and database operations organized.

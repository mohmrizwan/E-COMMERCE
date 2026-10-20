# Express Authentication Backend Template

A production-style Express.js backend template with authentication, MongoDB, Google OAuth, request validation, centralized error handling, security middleware, and structured logging.

## What This Template Includes

- Express 5 server setup using ES modules.
- MongoDB connection with Mongoose.
- Local user registration and login.
- Password hashing with bcrypt.
- Access token and refresh token generation with JWT.
- Refresh token storage on the user document.
- Google OAuth authentication with Passport.
- Cookie-based token delivery.
- Request validation using express-validator.
- Environment variable validation using Zod.
- Centralized async error forwarding.
- Centralized error handling middleware.
- Security middleware stack with Helmet, HPP, CORS, rate limiting, compression, cookie parsing, JSON parsing, and Morgan request logs.
- Pino logger with pretty development output.
- Layered backend structure: routes, controllers, services, repository, models, config, middleware, and utilities.

## Folder Structure

```txt
server/
|-- package.json
|-- package-lock.json
|-- server.js
|-- src/
|   |-- app.js
|   |-- config/
|   |   |-- env.js
|   |   |-- logger.js
|   |-- constant/
|   |   |-- app.constant.js
|   |-- database/
|   |   |-- db.js
|   |-- middlewares/
|   |   |-- errorHandler.middleware.js
|   |   |-- googleOauth.middleware.js
|   |   |-- security.middleware.js
|   |-- models/
|   |   |-- auth.model.js
|   |-- modules/
|   |   |-- auth/
|   |   |   |-- auth.controller.js
|   |   |   |-- auth.route.js
|   |   |   |-- auth.service.js
|   |-- repository/
|   |   |-- auth.repo.js
|   |-- shared/
|   |   |-- error/
|   |   |   |-- ApiError.js
|   |   |   |-- globalError.js
|   |-- utils/
|   |   |-- asyncHandler.js
|   |   |-- generateToken.js
|   |   |-- validRequest.js
|   |-- validation/
|   |   |-- validationRule.js
```

## Architecture Overview

### Entry Point

`server.js` starts the application. It connects to MongoDB first, then creates the Express app and starts listening on the configured port.

### App Setup

`src/app.js` creates the Express app, registers global middleware, registers API routes, and attaches the global error handler.

### Config

`src/config/env.js` loads `.env` values and validates them with Zod.

`src/config/logger.js` creates a Pino logger used by the app for structured logs.

### Database

`src/database/dbConnect.js` connects to MongoDB using the configured `MONGODB_URI`.

### Middleware

`security.middleware.js` applies common production middleware:

- `helmet` for secure HTTP headers.
- `hpp` for HTTP parameter pollution protection.
- `cors` for cross-origin requests.
- `express-rate-limit` for basic rate limiting.
- `compression` for compressed responses.
- `cookie-parser` for reading cookies.
- `morgan` for request logs.
- `passport.initialize()` for OAuth support.

`errorHandler.middleware.js` sends a consistent JSON error response.

`googleOauth.middleware.js` configures Google OAuth strategy.

### Auth Module

The auth module follows a layered structure:

- `auth.route.js` defines the auth endpoints.
- `auth.controller.js` handles HTTP request and response logic.
- `auth.service.js` contains business logic.
- `auth.repo.js` handles database operations.
- `auth.model.js` defines the user schema.

### Shared Errors

`src/shared/error/` contains reusable error classes so services can throw meaningful errors and the global error handler can return proper responses.

### Utilities

`asyncHandler.js` wraps async controllers and forwards thrown errors to Express.

`generateToken.js` creates JWT access and refresh tokens.

`validRequest.js` converts express-validator results into a clean validation error response.

### Validation

`validationRule.js` defines request validation rules for registration, login, and student-style request data.

## Included API Routes

Base route:

```txt
/api/user
```

Available auth routes:

```txt
POST /api/user/register
POST /api/user/login
GET  /api/user/google
GET  /api/user/google/callback
POST /api/user/forgot_password
GET  /api/user/reset-password/:token
POST /api/user/update-password/:id
```

Some password reset service logic is currently present as commented code, so those routes may need final implementation before production use.

## Environment Variables

Use [`backend/.env.example`](./.env.example) for local development and see the [single-vendor deployment guide](./DEPLOYMENT.md) for the exact Render and Vercel settings. The backend reads `MONGODB_URI` (not `MONGO_URL`).

## Installation

```bash
npm install
```

## Run The Server

```bash
npm start
```

By default, the server starts on:

```txt
http://localhost:3000
```

## Vendor Integrations

Configure Shiprocket only in the backend environment using the paired `SHIPROCKET_EMAIL` and `SHIPROCKET_PASSWORD` variables. Vendor profiles cannot save Shiprocket credentials; they only select the registered pickup location. Configure the variables before checkout or fulfillment that requires Shiprocket.

New single-store checkouts use Razorpay Standard Payments and do not require vendor linked accounts or vendor API credentials.

### Storefront domain

Each client's Vercel storefront points to that client's dedicated backend and database. The backend selects its one verified owner by `STORE_OWNER_ID`; it does not resolve tenants from the request domain. Add the client's domain to that client's Vercel project and set the same client's backend origin in `VITE_API_URL` for the storefront and vendor panel.

### Razorpay Standard Payments

Checkout creates one normal INR Razorpay order without Route transfers. The server calculates the order amount from database product prices and shipping quotes, stores the pending local payment, and returns the Razorpay order ID, amount, currency, and public Key ID. Payment verification loads that user's pending local payment, verifies the checkout signature against its stored Razorpay order ID, fetches the payment with the backend SDK, and requires the exact order, amount, INR currency, and captured/paid status before marking it paid. Authorized payments are captured server-side and fetched again before acceptance.

Configure `RAZORPAY_KEY_ID` and `RAZORPAY_SECRET` in the backend environment for each store deployment. The secret stays on the backend. The frontend may set `VITE_RAZORPAY_KEY_ID`, which must match the backend Key ID, or use the public Key ID returned by the backend. Configure the distinct `RAZORPAY_WEBHOOK_SECRET` in the backend and Razorpay Dashboard.

The webhook endpoint is `POST /webhooks/razorpay`. Subscribe to `payment.authorized`, `payment.captured`, and `payment.failed` for new checkout payments. The endpoint validates `X-Razorpay-Signature` over the exact raw body, checks payment/order references, amount and currency, and processes event IDs transactionally. Only captured events mark a payment paid; captured events also attempt idempotent order recovery. Legacy Route transfer and settlement webhook handling remains for historical payment records; it is not used to create new checkout payments. No live payment request has been made as part of this implementation.
## Main Dependencies

- `express` - HTTP server framework.
- `mongoose` - MongoDB ODM.
- `bcrypt` - Password hashing.
- `jsonwebtoken` - JWT access and refresh tokens.
- `passport` and `passport-google-oauth20` - Google OAuth.
- `express-validator` - Request validation.
- `zod` - Environment validation.
- `pino` and `pino-pretty` - Logging.
- `helmet`, `hpp`, `cors`, `express-rate-limit`, `compression` - Security and performance middleware.

## Notes For Developers

- Keep `env.js` independent from modules that depend on `env.js` to avoid circular imports.
- Return after calling `next()` or after sending a response with `res.json()`, `res.send()`, or `res.render()`.
- Keep controllers focused on HTTP logic and place business rules in services.
- Keep database queries inside repositories.
- Add tests before publishing this as a reusable npm package.


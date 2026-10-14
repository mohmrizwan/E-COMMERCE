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

`src/database/db.js` connects to MongoDB using the configured `MONGO_URL`.

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

Create a `.env` file in the `server/` folder:

```env
PORT=3000
MONGO_URL=mongodb://127.0.0.1:27017/your_database
GOOGLE_CALLBACK_URL=http://localhost:3000/api/user/google/callback
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
ACCESSTOKEN=your_access_token_secret
REFRESHTOKEN=your_refresh_token_secret
```

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

Set `INTEGRATION_ENCRYPTION_KEY` in the backend environment to a randomly generated 32-byte hex value. Generate one with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Keep this key in the backend secret store only. Losing or rotating it without re-encrypting stored credentials makes vendor Shiprocket credentials unreadable.

Authenticated vendors can read integration status at `GET /vendor/integrations` and update Shiprocket credentials at `PUT /vendor/integrations` with a `shiprocket` object containing `email`, `password`, and optionally `enabled`. GET and PUT responses report whether credentials are present, never their values. A blank credential on update leaves its stored value unchanged. The vendor identity comes from the bearer token; clients cannot select another vendor's record.

Shiprocket calls resolve credentials from the order's or shipment's vendor ID. Legacy global Shiprocket login credentials are no longer used by the service. Configure each vendor before checkout or fulfillment that requires that vendor's Shiprocket account.

For Razorpay Route, a vendor record stores the platform-provisioned linked-account ID, not vendor API credentials. The vendor settings endpoint deliberately rejects client-supplied linked-account IDs; mapping a vendor to a payout destination must be done by a trusted platform onboarding flow.

### Shared storefront domains

The public `GET /storefront` and `GET /storefront/products` endpoints resolve the browser `Origin` (or `Host` for same-origin calls) against `Vendor.storefrontDomains`. The domain list is platform-managed and must only be populated after domain ownership and DNS have been verified; do not add it to vendor self-service profile updates. A domain that does not match a verified vendor returns 404. The products endpoint only returns active products for that host's vendor. For Vercel, add each custom domain or `*.vendoraflame.com` to the same project. Vercel requires Vercel nameservers to issue wildcard certificates. Use the DNS values Vercel displays for the project; verified domains receive managed TLS. Configure the shared API origin in the frontend separately; the browser origin selects the storefront while all requests continue to use the one Render backend.

### Razorpay Route marketplace flow

Checkout is fail-closed unless the backend has `RAZORPAY_ROUTE_ENABLED=true`. It uses the platform Razorpay API key to create one INR Razorpay order with one Route transfer per vendor. Transfer allocations are calculated from database product prices and server-side shipping quotes; vendor item subtotal plus the vendor shipping allocation must exactly equal the charged order amount. Every vendor must have an enabled Route linked account whose account, Route product, and settlement configuration are marked approved. The checkout response omits transfer and linked-account identifiers. The client signature is still verified against the platform API secret, and captured payment details are fetched from Razorpay before an order is marked paid.

Razorpay's current Route requirements are stricter than merely creating a linked account. Route is subject to account eligibility (current documentation lists domestic turnover above ₹40 lakh in FY25 or FY26, or export FIRC above ₹5 lakh) and a written payer-payee transparency review. Linked-account onboarding, stakeholder details, Route product configuration, bank verification, and account approval are external prerequisites. Eligibility of this platform's account cannot be inferred from code; check the Razorpay Dashboard/support for approval. The existing onboarding code must be verified in test mode against the current account/product onboarding steps before production use. See [Route eligibility and integration](https://razorpay.com/docs/payments/route/integration-guide) and [Linked Account onboarding](https://razorpay.com/docs/payments/route/linked-account).

The webhook endpoint is `POST /webhooks/razorpay`. Set a distinct `RAZORPAY_WEBHOOK_SECRET` in Render and configure the same secret in the Razorpay Dashboard. Subscribe to Route `transfer.processed`, `transfer.failed`, and `settlement.processed` events. The endpoint verifies `X-Razorpay-Signature` over the exact raw body; webhook events are deduplicated and financial updates are transactional. A transfer is shown as completed income only after Route reports its transfer processed and the transfer's fetched settlement status is `settled`. `transfer.processed` alone does not mean bank settlement. Razorpay Route docs describe these statuses, delayed order-transfer retries, and settlement reconciliation in [Transfer Funds](https://razorpay.com/docs/payments/route/transfer-funds-to-linked-accounts) and [Route Webhooks](https://razorpay.com/docs/webhooks/route).

**Not complete or live-verified:** no refund request workflow exists in this application, so refunds and transfer reversals have not been implemented. Razorpay documents that a refund after Route transfers requires corresponding reversals (or its explicitly configured reverse-all option); do not refund from the Dashboard until a reconciliation policy is in place. [Route refunds and reversals](https://razorpay.com/docs/payments/route/refund). No live payment, sandbox transfer, settlement, refund, or reversal has been executed. The platform must test all of these in Razorpay Test Mode and verify successful linked-account settlement evidence before enabling the global flag in production.

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


# Single vendor client deployment

Deploy one copy of this backend and one MongoDB database per client. Deploy `frontend/` and `vendor-panel/` as separate Vercel projects (or configure their separate build roots). Point both frontend projects at that client's backend. Keep payment, mail, database, encryption, and shipping passwords in Render only.

Create the vendor account in the client's database, verify its email, then set `STORE_OWNER_ID` to that vendor document's `_id`. The ID must come from the same MongoDB database as `MONGODB_URI`. See [OWNER_SETUP.md](./OWNER_SETUP.md).

## Environment variables

| Exact name | Where | Secret? | Purpose | Required / redeploy |
| --- | --- | --- | --- | --- |
| `MONGODB_URI` | Render backend | Yes | Full MongoDB connection string, starting with `mongodb://` or `mongodb+srv://` | Required; restart/redeploy backend after changes |
| `STORE_OWNER_ID` | Render backend | No (but deployment-controlled) | Verified vendor `_id` authorized to own this store | Required; restart/redeploy backend after changes |
| `JWT_SECRET` | Render backend | Yes | Signs customer and vendor login tokens | Required; changing it invalidates existing tokens; restart/redeploy |
| `RAZORPAY_KEY_ID` | Render backend | Public identifier, but keep server-side here | Client's Razorpay key ID for standard payments | Required for checkout; restart/redeploy |
| `RAZORPAY_SECRET` | Render backend | Yes | Authenticates backend Razorpay API calls and checkout signature verification | Required for checkout; restart/redeploy |
| `RAZORPAY_WEBHOOK_SECRET` | Render backend and Razorpay webhook configuration | Yes | Validates webhook signatures; must match the secret configured for this endpoint | Required for signed webhooks and automatic paid-order recovery; restart/redeploy after changes |
| `EMAIL_USER` | Render backend | Yes | Gmail SMTP account used to send OTP and reset emails | Required for email signup/verification/reset flows; restart/redeploy |
| `EMAIL_PASS` | Render backend | Yes | Gmail app password for `EMAIL_USER` | Required for email signup/verification/reset flows; restart/redeploy |
| `CLOUDINARY_CLOUD_NAME` | Render backend | No | Cloudinary account used for product and banner image uploads | Required for image uploads; restart/redeploy |
| `CLOUDINARY_API_KEY` | Render backend | Public identifier; keep in backend config | Authenticates Cloudinary image uploads | Required for image uploads; restart/redeploy |
| `CLOUDINARY_API_SECRET` | Render backend | Yes | Signs Cloudinary upload requests | Required for image uploads; restart/redeploy |
| `GOOGLE_CLIENT_ID` | Render backend | Public identifier | Verifies Google sign-in tokens when the Google sign-in endpoint is used | Optional; restart/redeploy backend after changes |
| `SHIPROCKET_EMAIL` | Render backend | Yes | Client's Shiprocket API user email; use with `SHIPROCKET_PASSWORD` | Required for Shiprocket; set both together; restart/redeploy |
| `SHIPROCKET_PASSWORD` | Render backend | Yes | Client's Shiprocket API user password | Required for Shiprocket; set both together; restart/redeploy |
| `SHIPROCKET_COURIER_ID` | Render backend | No | Optional preferred numeric courier ID; if unset the backend selects the lowest valid serviceable rate | Optional; restart/redeploy |
| `PORT` | Render backend (provided by Render) | No | HTTP listen port; local default is `3000` | Render supplies this; no manual configuration normally needed |
| `VITE_API_URL` | Vercel storefront **and** Vercel vendor panel | No | This client's backend origin, without `/api` or a trailing slash | Required in each project; changing it requires a new frontend deployment |
| `VITE_STORE_NAME` | Vercel storefront **and** vendor panel | No | Client's store name used in storefront copy and vendor-panel branding | Optional; rebuild each frontend after changes |
| `VITE_RAZORPAY_KEY_ID` | Vercel storefront | Public | Optional fallback public Key ID; checkout normally receives the Key ID from the backend | Optional; rebuild frontend after changes. Never put `RAZORPAY_SECRET` here |

For local development, copy `backend/.env.example` to `backend/.env`, and copy the frontend or vendor-panel `.env.example` to that project's `.env`. Replace every placeholder. Do not paste a MongoDB URI that contains angle-bracket placeholders; percent-encode special characters in the database username/password.

Set both `SHIPROCKET_EMAIL` and `SHIPROCKET_PASSWORD` in Render. Shiprocket credentials are deployment-managed only; the vendor profile cannot save credentials. The profile is still used to select the registered pickup location.

## Payment and fulfillment behavior

The normal checkout uses standard Razorpay orders and does not create Route transfers or split settlements. `RAZORPAY_WEBHOOK_SECRET` must be the distinct webhook secret configured for `/webhooks/razorpay`; a verified `payment.captured` webhook can recover the order if the browser closes before the order confirmation request finishes. Order creation is idempotent and stock is checked and decremented transactionally. Use a MongoDB replica set or Atlas deployment that supports transactions.

Shiprocket uses the documented email/password API login, serviceability rates, and shipment APIs. Product package dimensions and weight and the vendor pickup location must be configured for real shipping quotes. Shipment creation uses a reservation and read-only reconciliation after ambiguous failures; unresolved reservations require operator review and are not automatically resubmitted.

Razorpay Route onboarding and historical transfer/settlement reconciliation code remains for existing records. It is not part of this single-vendor checkout and must not be configured as a client payment requirement. No live payments, webhooks, or Shiprocket shipments are made by the automated tests.

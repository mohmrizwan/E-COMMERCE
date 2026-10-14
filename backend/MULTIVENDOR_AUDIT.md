# Multi-vendor architecture audit

## Existing implementation

- One React/Vite app and one Express/MongoDB backend are already present.
- Vendor authentication is token based; product, order, dashboard, transaction, integration, and shipment routes use vendor auth and generally scope records to `req.vendor._id`.
- Vendor Shiprocket email and password are encrypted at rest. Pickup addresses are stored per vendor, and shipment records carry `vendorId`.
- Razorpay Route linked-account onboarding exists. Client requests cannot set linked account IDs, and onboarding status is checked against the linked account and product configuration.
- Customer checkout calculates amounts from database products, creates a single Razorpay order, and verifies/captures its payment with platform Razorpay credentials. Vendor Route transfers and payment webhooks are absent.
- The public product catalog previously returned active products from every vendor and did not resolve a storefront domain.

## Prioritized plan and progress

1. **Domain tenant resolution — implemented in this change.** A trusted operator assigns verified domains to `Vendor.storefrontDomains`; the public storefront API resolves `Origin`/`Host` against that list. Storefront product results are vendor filtered, and checkout rejects products from another vendor when called from a mapped storefront. The existing React catalog calls the storefront endpoint and retains the central catalog on an unmapped root domain.
2. **Credential/log hygiene — partially implemented.** Removed full Shiprocket response bodies and successful raw order payloads from service logs/results. Further review of all controllers and operational log retention remains needed.
3. **Razorpay settlement — incomplete and release blocking.** Implement Route transfers per vendor after capture, persist transfer state/idempotency, process signed webhooks, reconcile retries, and implement refund reversals. Validate Route account/product activation and settlement verification in Razorpay's approved account. Current checkout still charges via the platform Razorpay account and must not be treated as vendor settlement.
4. **Isolation regression coverage — partial.** Added host normalization tests. Existing tests cover cart normalization, idempotent order creation, Razorpay payment verification, and the disabled arbitrary Shiprocket test endpoint. Add API-level authorization and cross-vendor shipment/order tests with a test database before production rollout.
5. **Shiprocket production verification — incomplete.** Existing flow uses each order vendor's encrypted credentials and pickup address, but the full order-to-AWB-to-pickup-to-tracking flow was not exercised against vendor accounts. Add request idempotency and provider webhook/status reconciliation before claiming production readiness.

## Deployment and account requirements

- Add each verified custom domain to the same Vercel project; point customer domains or wildcard subdomains to that project. Vercel wildcard certificate issuance requires Vercel nameservers for DNS-01 validation.
- For the shared Render backend, configure only global secrets (MongoDB URI, JWT secrets, integration encryption key, and platform Razorpay Route credentials). Vendor credentials and linked-account mappings stay in MongoDB.
- Assign `storefrontDomains` only after verifying ownership. Configure the frontend's `VITE_API_URL` for the shared Render API. Browser API calls send the storefront's Origin; keep domain resolution backed by the verified database allowlist.
- Razorpay Route is the marketplace mechanism for splitting a platform payment among linked accounts. Vendor Route onboarding and required product/settlement-account approval are external prerequisites. An individual vendor's standard Razorpay API key pair does not make a platform order settle directly to that vendor.

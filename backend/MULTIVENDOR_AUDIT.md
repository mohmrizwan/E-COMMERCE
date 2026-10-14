# Multi-vendor architecture audit

## Existing implementation

- One React/Vite app and one Express/MongoDB backend are present. Vendor APIs generally scope records to the authenticated vendor.
- Vendor Shiprocket credentials are encrypted at rest, pickup addresses are stored per vendor, and shipment records carry a vendor ID. Full provider shipping lifecycle validation remains outstanding.
- Razorpay Route linked-account onboarding exists. Vendor mappings store linked-account IDs, not vendor API credentials. Account and product activation are checked during checkout.
- Customer checkout prices products on the server and creates one INR platform Razorpay order. When `RAZORPAY_ROUTE_ENABLED=true`, it includes one Route transfer per vendor, including that vendor's item subtotal and quoted shipping amount. Transfer IDs are saved to the payment record. The flag defaults off, so checkout fails closed until operators explicitly enable the approved Route integration.
- Payment callback verification still verifies and captures the platform payment. Signed webhook processing records Route transfer status and reconciles settlement events against provider transfer data. Vendor transaction status and dashboard income now require a processed transfer and settled recipient funds.
- Refunds and corresponding Route reversals are not implemented. The checkout and settlement code has not been exercised against a Razorpay test account or live account.
- The public product catalog resolves mapped storefront domains and filters catalog results by vendor. Checkout also rejects a mapped storefront's cross-vendor cart.

## Prioritized plan and progress

1. **Domain tenant resolution — implemented.** A trusted operator assigns verified domains to `Vendor.storefrontDomains`; the public storefront API resolves `Origin`/`Host` against that list. Storefront results are vendor filtered, and checkout rejects products from another vendor on a mapped storefront. The central catalog remains available on an unmapped root domain.
2. **Credential and log hygiene — partially implemented.** Shiprocket response bodies and successful raw order payloads were removed from service logs/results. Review of all controllers and operational log retention remains needed.
3. **Razorpay settlement — implementation present, verification incomplete, release blocking.** Route order transfers are created per vendor, persisted, reconciled through signed/idempotent webhooks, and reflected in vendor transaction and income status. No refunds or Route reversal workflow exists. Verify onboarding, account eligibility, fee allocation, sandbox behavior, retries, and webhook reconciliation with Razorpay before enabling this flow in production.
4. **Isolation regression coverage — partial.** Domain normalization, Route allocation constraints, and webhook signature checks have focused tests. API-level authorization and cross-vendor shipment/order tests with a test database remain necessary before production rollout.
5. **Shiprocket production verification — incomplete.** Existing flow uses each order vendor's encrypted credentials and pickup address, but the full order-to-AWB-to-pickup-to-tracking flow was not exercised against vendor accounts. Add request idempotency and provider webhook/status reconciliation before claiming production readiness.

## Deployment and account requirements

- Add each verified custom domain to the same Vercel project; point customer domains or wildcard subdomains to that project. Vercel wildcard certificate issuance requires Vercel nameservers for DNS-01 validation.
- Configure global backend secrets, including MongoDB URI, JWT secrets, integration encryption key, platform Razorpay key ID/secret, and a distinct `RAZORPAY_WEBHOOK_SECRET`. Configure the Razorpay webhook endpoint at `/webhooks/razorpay` for transfer and settlement events.
- Keep `RAZORPAY_ROUTE_ENABLED` unset or false until Razorpay has approved the platform and linked accounts, sandbox checks are complete, and the marketplace refund/reversal path has been implemented. Vendor credentials and linked-account mappings stay in MongoDB; never accept recipient account IDs from clients.
- Assign `storefrontDomains` only after verifying ownership. Configure frontend `VITE_API_URL` for the shared backend; keep domain resolution backed by the verified database allowlist.
- Razorpay Route can split an order across linked accounts, subject to account/product approval, eligibility, and sufficient balances. Do not equate a paid customer order with settled vendor funds. Refunds require corresponding Route reversals or a deliberately configured provider refund option; neither is implemented here.

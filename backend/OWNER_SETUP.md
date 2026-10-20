# Deployment store owner

Each deployment authorizes exactly one verified vendor account. Vendor signup remains public and creates an unverified account; the six-digit email OTP must be verified before the account can log in. Signup, OTP verification, and client-supplied role/owner fields do not grant store-owner access.

After completing signup and OTP verification, configure the selected vendor account's MongoDB `_id` as `STORE_OWNER_ID` in the backend environment. For local development, add this line to `backend/.env`:

```dotenv
STORE_OWNER_ID=the_verified_vendor_mongodb_object_id
```

Find the ID in MongoDB Compass by opening the database used by the local backend, selecting the `vendors` collection, and filtering for the intended account with `isVerified: true` (and its email). Copy only that document's `_id` value, which should be a 24-character hexadecimal ObjectId. Do not use an ID supplied by the browser. Restart the backend after changing `backend/.env`.

The backend compares `STORE_OWNER_ID` with the verified vendor's MongoDB `_id` during login and protected vendor authentication. Public catalog, storefront, banner, and order creation paths resolve the same configured and verified account. If the setting is missing, malformed, or does not identify a verified account, those paths fail closed; configure it before testing the store.

The Mongoose schema no longer declares the legacy `ownerSlot` field or `single_store_owner` index. No database records or existing database indexes are removed by this change. Existing records are left intact; a previously created physical MongoDB index may remain until separately reviewed by an operator.


| Priority | Kaam                                      | Kyun zaroori hai?                                                  |
| -------- | ----------------------------------------- | ------------------------------------------------------------------ |
| 1        | Customer frontend ke API URLs fix karna   | Galat backend se products ya account data aa sakta hai.            |
| 2        | Successful payment ke baad order recovery | Payment successful hone par bhi order creation fail ho sakta hai.  |
| 3        | Transaction aur income reports fix karna  | Standard Razorpay payments ki sales galat dikh sakti hain.         |
| 4        | Razorpay sandbox testing                  | Verify karna hai ki payment se order tak flow sahi hai.            |
| 5        | Shiprocket testing                        | Rates, shipment, AWB aur tracking verify karna hai.                |
| 6        | Cancellation/refund workflow              | Order cancel aur refund ka process complete karna hai.             |
| 7        | Marketplace UI cleanup                    | Unnecessary vendor aur marketplace-related UI review karni hai.    |
| 8        | Multiple clients ke liye deployment       | Har client ka database, domain aur credentials isolate karne hain. |

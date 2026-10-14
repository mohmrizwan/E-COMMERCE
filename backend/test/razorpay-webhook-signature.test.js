import test from "node:test";
import assert from "node:assert/strict";
import crypto from "crypto";
import { verifyRazorpayWebhookSignature } from "../src/utils/RazorpayWebhookSignature.js";

test("validates Razorpay webhook signatures using the exact raw body and webhook secret", () => {
  const rawBody = Buffer.from('{"event":"transfer.processed"}');
  const signature = crypto.createHmac("sha256", "webhook-only-secret").update(rawBody).digest("hex");
  assert.equal(verifyRazorpayWebhookSignature({ rawBody, signature, secret: "webhook-only-secret" }), true);
  assert.equal(verifyRazorpayWebhookSignature({ rawBody: Buffer.from(`${rawBody} `), signature, secret: "webhook-only-secret" }), false);
  assert.equal(verifyRazorpayWebhookSignature({ rawBody, signature, secret: "api-secret" }), false);
});

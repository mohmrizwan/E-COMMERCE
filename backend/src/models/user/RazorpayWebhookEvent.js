import mongoose from "mongoose";

const schema = new mongoose.Schema({
  eventId: { type: String, required: true, unique: true },
  event: { type: String, required: true },
  receivedAt: { type: Date, default: Date.now },
  processedAt: { type: Date },
});

export default mongoose.model("RazorpayWebhookEvent", schema);

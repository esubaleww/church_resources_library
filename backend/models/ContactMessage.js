const mongoose = require("mongoose");

const replySchema = new mongoose.Schema(
  {
    author: { type: String, enum: ["admin", "user"], required: true },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

const contactMessageSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ["open", "answered", "closed"],
      default: "open",
    },
    replies: [replySchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("ContactMessage", contactMessageSchema);

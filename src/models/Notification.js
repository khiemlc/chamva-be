// models/Notification.js
const { Schema, model } = require("mongoose");

const notificationSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["Task", "Comment", "Board"], required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    link: { type: String }, // URL đến task/board liên quan
  },
  { timestamps: true }
);

module.exports = model("Notification", notificationSchema);

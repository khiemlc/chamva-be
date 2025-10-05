// models/User.js
const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { 
      type: String, 
      enum: ["Admin", "Manager", "Member"], 
      default: "Member" 
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = model("User", userSchema);

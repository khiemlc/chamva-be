// models/Category.js
const { Schema, model, Types } = require("mongoose");

const categorySchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

module.exports = model("Category", categorySchema);

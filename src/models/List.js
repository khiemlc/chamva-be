// models/List.js
const { Schema, model } = require("mongoose");

const listSchema = new Schema(
  {
    title: { type: String, required: true },
    board: { type: Schema.Types.ObjectId, ref: "Board", required: true },
    order: { type: Number, default: 0 }, // vị trí trong board
  },
  { timestamps: true }
);

module.exports = model("List", listSchema);

// models/Comment.js
const { Schema, model } = require("mongoose");
const mongoose = require("mongoose");

const commentSchema = new Schema(
  {
    task: { type: Schema.Types.ObjectId, ref: "Task", required: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    mentions: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // danh sách user được tag @
    attachments: [
      {
        url: String,
        type: { type: String, enum: ["image", "document"] },
        name: String
      }
    ],
  },
  { timestamps: true }
);

module.exports = model("Comment", commentSchema);

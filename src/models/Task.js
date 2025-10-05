// models/Task.js
const { Schema, model } = require("mongoose");

const taskSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    board: { type: Schema.Types.ObjectId, ref: "Board", required: true },
    assignees: [{ type: Schema.Types.ObjectId, ref: "User" }],
    attachments: [
      {
        url: String,
        type: { type: String, enum: ["image", "document"] },
        name: String
      }
    ],
    status: {
      type: String,
      enum: ["todo", "progress", "complete"],
      default: "todo"
    },
    checklist: [
      {
        text: String,
        isChecked: { type: Boolean, default: false },
      }
    ],
    labels: [{ type: String }], // ví dụ: "High Priority", "Bug"
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  },
  { timestamps: true }
);

module.exports = model("Task", taskSchema);

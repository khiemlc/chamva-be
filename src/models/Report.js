// models/Report.js
const { Schema, model } = require("mongoose");

const reportSchema = new Schema(
  {
    board: { type: Schema.Types.ObjectId, ref: "Board", required: true },
    generatedBy: { type: Schema.Types.ObjectId, ref: "User" },
    data: Schema.Types.Mixed, // lưu JSON thống kê (task done, đang làm, trễ deadline, v.v.)
  },
  { timestamps: true }
);

module.exports = model("Report", reportSchema);

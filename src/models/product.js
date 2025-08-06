// models/Product.js
const { Schema, model, Types } = require("mongoose");

const productSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    category: { type: Types.ObjectId, ref: "Category", required: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 }, // hiện giá bán
    stock: { type: Number, default: 0, min: 0 },
    images: [{ type: String, trim: true }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// index để tìm theo tên, slug, category
productSchema.index({ name: "text", description: "text" });
productSchema.index({ category: 1 });

module.exports = model("Product", productSchema);

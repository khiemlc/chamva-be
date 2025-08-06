// models/Order.js
const { Schema, model, Types } = require("mongoose");

const orderItemSchema = new Schema(
  {
    product: { type: Types.ObjectId, ref: "Product", required: true },
    name: { type: String, required: true }, // lưu tên product lúc mua để tránh mất dữ liệu nếu product thay đổi
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 }, // giá tại thời điểm mua
    images: [{ type: String }], // optional: lưu ảnh nhỏ nếu muốn show trong order
  },
  { _id: false }
); // không cần _id cho từng item, tùy chọn

const orderSchema = new Schema(
  {
    user: { type: Types.ObjectId, ref: "User", required: true },
    orderItems: {
      type: [orderItemSchema],
      required: true,
      validate: (v) => Array.isArray(v) && v.length > 0,
    },
    shippingAddress: {
      fullName: { type: String },
      phone: { type: String },
      addressLine1: { type: String },
      addressLine2: { type: String, default: null },
      city: { type: String },
      country: { type: String, default: "Vietnam" },
    },
    paymentMethod: { type: String, default: "CASH" }, // hoặc 'VNPAY','PAYPAL',...
    itemsPrice: { type: Number, required: true, min: 0 }, // tổng hàng trước phí
    shippingPrice: { type: Number, default: 0, min: 0 },
    taxPrice: { type: Number, default: 0, min: 0 },
    totalPrice: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: [
        "PENDING",
        "PAID",
        "PROCESSING",
        "SHIPPED",
        "COMPLETED",
        "CANCELLED",
        "REFUNDED",
      ],
      default: "PENDING",
    },
    paidAt: { type: Date, default: null },
    shippedAt: { type: Date, default: null },
    deliveredAt: { type: Date, default: null },
    note: { type: String, default: null },
  },
  { timestamps: true }
);

orderSchema.index({ user: 1, status: 1, createdAt: -1 });

module.exports = model("Order", orderSchema);

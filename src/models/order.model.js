"use strict";
const { model, Schema, Types } = require("mongoose");

const DOCUMENT_NAME = "Order";
const COLLECTION_NAME = "Orders";

const orderSchema = new Schema(
  {
    orderId: { type: Schema.Types.ObjectId, required: true },
    userId: { type: Schema.Types.ObjectId, required: true },
    userName: { type: String, required: true },
    userAddress: { type: String, required: true },
    userPhone: { type: String, required: true },
    userEmail: { type: String, required: true },
    totalPrice: { type: Number, required: true },
    createdDate: { type: Date, default: Date.now },
    order_products: { type: Array, required: true, default: true },
    status: { type: String, required: true, default: "Pending" },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

module.exports = { order: model(DOCUMENT_NAME, orderSchema)};
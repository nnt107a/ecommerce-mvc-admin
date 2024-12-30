"use strict";
const { model, Schema, Types } = require("mongoose"); // Erase if already required

const DOCUMENT_NAME = "Cart";
const COLLECTION_NAME = "Carts";

const cartSchema = new Schema(
  {
    cart_products: { type: Array, required: true, default: true },
    /*
    [
     {
        product_id: Number,
        quantity: Number,
        price: Number
     }]
    */
    cart_count_products: { type: Number, default: 0 },
    cart_userId: { type: Schema.Types.ObjectId, required: true },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: {
      createAt: "createOn",
      updateAt: "modifyOn",
    },
  }
);
module.exports = { cart: model(DOCUMENT_NAME, cartSchema) };

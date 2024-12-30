"use strict";
const { model, Schema, Types } = require("mongoose"); // Erase if already required

const DOCUMENT_NAME = "Review";
const COLLECTION_NAME = "Reviews";

const reviewSchema = new Schema(
  {
    product_id: { type: Schema.Types.ObjectId, required: true },
    email: {
      type: String,
      trim: true,
    },
    user_name: {
      type: String,
      trim: true,
    },
    star: {
      type: Number,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);
module.exports = model(DOCUMENT_NAME, reviewSchema);

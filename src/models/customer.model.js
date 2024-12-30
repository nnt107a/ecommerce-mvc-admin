"use strict";
const { model, Schema, Types } = require("mongoose"); // Erase if already required

const DOCUMENT_NAME = "Customer";
const COLLECTION_NAME = "Customers";

const customerSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      maxLength: 150,
      unique: true,
    },
    avatar: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "inactive",
    },
    lastLogin: {
			type: Date,
			default: Date.now,
		},
		isVerified: {
			type: Boolean,
			default: false,
		},
		resetPasswordToken: String,
		resetPasswordExpiresAt: Date,
		verificationToken: String,
		verificationTokenExpiresAt: Date,
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);
const Customer = model(DOCUMENT_NAME, customerSchema);
module.exports = Customer;

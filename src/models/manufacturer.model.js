"use strict";
const { model, Schema, Types } = require("mongoose");

const DOCUMENT_NAME = "Manufacturers";
const COLLECTION_NAME = "Manufacturers";

const manufacturerSchema = new Schema(
  {
    manufacturer_name: {
      type: String,
      required: true,
    }
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

module.exports = { manufacturer: model(DOCUMENT_NAME, manufacturerSchema) };
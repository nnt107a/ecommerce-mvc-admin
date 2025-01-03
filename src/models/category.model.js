"use strict";
const { model, Schema, Types } = require("mongoose");

const DOCUMENT_NAME = "Categories";
const COLLECTION_NAME = "Categories";

const categorySchema = new Schema(
  {
    category_name: {
      type: String,
      required: true,
    }
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

module.exports = { category: model(DOCUMENT_NAME, categorySchema) };
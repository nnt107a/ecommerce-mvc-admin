const ApikeySchema = require("../models/apikey.model");
const crypto = require("crypto");
const findById = async (key) => {
  const objKey = await ApikeySchema.findOne({ key, status: true }).lean();
  return objKey;
};

module.exports = { findById };

"use strict";
const customerModel = require("../models/customer.model");
const { ObjectId } = require("mongodb");

const findByEmail = async ({
  email,
  select = { email: 1, password: 2, name: 1, status: 1, role: 1 },
}) => {
  return await customerModel.findOne({ email }).select(select).lean();
};
const findById = async ({ userId, select = { email: 1, name: 1 } }) => {
  return await customerModel
    .findOne({ _id: new ObjectId(userId) })
    .select(select)
    .lean();
};
module.exports = { findByEmail, findById };

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
const getAllUser = async (limit, skip, searchQuery, sortBy) => {
  const query = {
    $or: [
        { name: { $regex: searchQuery, $options: 'i' } },
        { email: { $regex: searchQuery, $options: 'i' } }
    ]
  };
  let sortOption = {};
  if (sortBy === "nameA") {
    sortOption = { name: 1 };
  } else if (sortBy === "nameZ") {
    sortOption = { name: -1 }; 
  } else if (sortBy === "email") {
    sortOption = { email: 1 };
  } else if (sortBy === "createdAtL") {
    sortOption = { createdAt: -1};
  } else if (sortBy === "createdAtO") {
    sortOption = { createdAt: 1};
  }
  const [accounts, total] = await Promise.all([
    customerModel.find(query).sort(sortOption).skip(skip).limit(limit), // Fetch products for the current page
    customerModel.countDocuments(query), // Get the total count of products
  ]);
  console.log(total, accounts, sortOption, query);

  const totalPages = Math.ceil(total / limit);

  return { accounts, totalPages };
};
const getUserById = async (id) => {
  return await customerModel.findOne({ _id: new ObjectId(id) }).lean();
}
const updateStatus = async (id, status) => {
  return await customerModel.updateOne({ _id: new ObjectId(id) }, { status });
}
module.exports = { findByEmail, findById, getAllUser, getUserById, updateStatus };

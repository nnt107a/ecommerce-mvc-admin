"use strict";
const { order } = require("../models/order.model");
const { model, Schema, Types } = require("mongoose"); // Ensure Types is imported

class OrderService {
    static async createUserOrder(userId, name, address, phone, email, price, products) {
        console.log("creat", userId, price);
        const orderID = new Types.ObjectId().toString();
        const query = { orderId: orderID, userId: userId },
          updateOrInsert = {
            $set: {
              userName: name,
              userAddress: address,
              userPhone: phone,
              userEmail: email,
              totalPrice: price,
              order_products: products,
            },
          },
          option = { upsert: true, new: true };
        return await order.findOneAndUpdate(query, updateOrInsert, option);
      }
      static async getAllUserOrders(userId) {
        console.log("get all user orders", userId);

        const userOrders = await order.find({ userId: new Types.ObjectId(userId) }).lean();
        console.log(userOrders);
    
        if (!userOrders || userOrders.length === 0) {
          return [];
        }
    
        // Extract relevant fields for each order
        return userOrders;
      }
      static async getOrderById(orderId) {
        console.log("get order by id", orderId);
        return await order.findOne({ orderId: orderId }).lean();
      }
}
module.exports = OrderService;

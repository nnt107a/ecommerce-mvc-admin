"use strict";
const keyTokenSchema = require("../models/keytoken.model");
const { Type } = require("mongoose");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types; // Nhập ObjectId từ Mongoose

class KeyTokenService {
  static createKeyToken = async ({
    userId,
    publicKey,
    privateKey,
    refreshToken,
  }) => {
    try {
      console.log("Creating/updating key token...");

      const filter = { userId:new ObjectId(userId) }; // Đảm bảo userId là ObjectId
      const update = {
        publicKey,
        privateKey,
        refreshTokenUsed: [],
        refreshToken,
      };
      const options = { upsert: true, new: true };

      const tokens = await keyTokenSchema.findOneAndUpdate(
        filter,
        update,
        options
      );

      console.log("Key token created/updated successfully.");
      return tokens; // Trả về toàn bộ document sau khi cập nhật
    } catch (e) {
      console.error("Error in createKeyToken:", e);
      throw new Error("Unable to create or update key token.");
    }
  };
  // static createKeyToken = async ({
  //   userId,
  //   publicKey,
  //   privateKey,
  //   refreshToken,
  // }) => {
  //   try {
  //     console.log("key ok!")
  //     const filter = { user: userId },
  //       update = { publicKey, privateKey, refreshTokenUsed: [], refreshToken },
  //       options = { upsert: true, new: true };
  //     const tokens = await keyTokenSchema.findOneAndUpdate(
  //       filter,
  //       update,
  //       options
  //     );
  //     console.log("key 2 ok!")

  //     return tokens ? tokens.publicKey : null;
  //   } catch (e) {
  //     return e;
  //   }
  // };
  static findById = async (userId) => {
    return await keyTokenSchema.findOne({ userId: new ObjectId(userId) }).lean();
  };
  static removeByUserid = async (userId) => {
    return await keyTokenSchema.deleteOne({ userId: new ObjectId(userId) }); // Sử dụng deleteOne để xóa tài liệu
  };
}
module.exports = KeyTokenService;

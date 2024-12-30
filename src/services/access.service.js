"use strict";
const bcrypt = require("bcrypt");
const { getInforData } = require("../utils/index");
const { findById } = require("./customer.service");
const customerModel = require("../models/customer.model");
const {
  ConflictRequestError,
  NotFoundError,
  FORBIDDEN,
} = require("../core/error.response");
const {
  sendVerificationEmail,
  sendWelcomeEmail,
} = require("../mailtrap/email");
class AccessService {
  static signUp = async ({ name, email, password }) => {
    console.log("signUp", name, email, password);
    const emailAvailable = await customerModel.findOne({ email }).lean();
    if (emailAvailable) {
      console.log("Email error");
      throw new ConflictRequestError("Email is not available", 500);
    }
    const userNameAvailable = await customerModel.findOne({ name }).lean();
    if (userNameAvailable) {
      console.log("name error");

      throw new ConflictRequestError("User name is not available", 500);
    }
    console.log("userNameAvailable", userNameAvailable);
    const verificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const passwordHash = await bcrypt.hash(password, 10);
    const newCustomer = await customerModel.create({
      name,
      email,
      password: passwordHash,
      verificationToken,
      role: "Admin",
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    });
    if (!newCustomer) {
      throw new Error("Failed to create new shop");
    }
    await sendVerificationEmail(email, verificationToken);
    console.log("Verification email sent");
    return {
      success: true,
      newCustomer: newCustomer,
      metadata: {
        shop: getInforData({
          fields: ["id", "name", "email"],
          object: newCustomer,
        }),
      },
    };
  };
  static resendVerifycation = async (userId) => {
    const myUser = await findById({ userId });
    const email = myUser.email;
    if (!email) {
      throw new NotFoundError(`User not found`);
    }
    const verificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    await sendVerificationEmail(email, verificationToken);
    const user = await customerModel.findOne({ email });
    if (!user) {
      throw new NotFoundError(`User ${email} not found`);
    }
    user.verificationToken = verificationToken;
    user.isVerified = false;
    await user.save();
    return {
      success: true,
    };
  };
  static verifyEmail = async (userId, verificationToken) => {
    const myUser = await findById({ userId });
    const email = myUser.email;
    console.log(email);
    if (!email) {
      throw new NotFoundError(`User ${email} not found`);
    }
    console.log("service verified email", email);
    const user = await customerModel.findOne({ email });
    console.log("=======before check user");
    if (!user) {
      throw new NotFoundError(`User ${email} not found`);
    }
    console.log("=======before check");
    if (user.verificationToken === verificationToken) {
      user.isVerified = true;
      user.verificationToken = null;
      user.verificationTokenExpiresAt = null;
      await user.save();
      console.log("before send email");
      await sendWelcomeEmail(email, user.name);
      return {
        success: true,
      };
    } else {
      console.log("error verification token");
      throw new FORBIDDEN("Verification token is incorrect");
    }
  };

  static getUserById = async (userId) => {
    const user = await customerModel.findById(userId);

    if (!user) {
      return null;
    }

    return user;
  };

  static getAvatar = async (userId) => {
    const user = await customerModel.findById(userId);

    if (!user) {
      return null;
    }

    return user.avatar;
  };
}
module.exports = AccessService;

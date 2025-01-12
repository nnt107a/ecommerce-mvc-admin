"use strict";
const review = require("../models/review.model.js");
const { BadRequestError, FORBIDDEN } = require("../core/error.response");
const { ObjectId } = require("mongodb");
const { findById } = require("../services/customer.service.js");
class ReviewService {
  static async createUserReview(productId, comment, star, userId) {
    if (!userId) {
      throw new FORBIDDEN("User need login to review");
    }
    const userInfo = await findById({ userId });
    const userEmail = userInfo.email;
    const userReviewed = await review.findOne({
      email: userEmail,
      product_id: new ObjectId(productId),
    });
    if (userReviewed) {
      throw new FORBIDDEN("User has already reviewed this product");
    }
    const newReview = await review.create({
      email: userInfo.email,
      product_id: productId,
      comment,
      star,
      user_name: userInfo.name,
    });
    if (!newReview) {
      throw new BadRequestError("Failed to create review");
    }
    return {
      success: true,
      metadata: {
        review: newReview,
      },
    };
  }
  static async getReviews(productId, skip, limit) {
    const reviews = await review.find({ product_id: new ObjectId(productId) })
      .skip(skip)
      .limit(limit)
      .lean();
    const totalReviews = await review.countDocuments({ product_id: new ObjectId(productId) });
    return {
      success: true,
      reviews,
      totalReviews,
      totalPages: Math.max(Math.ceil(totalReviews / limit), 1),
      currentPage: Math.floor(skip / limit) + 1,
    };
  }
}
module.exports = ReviewService;

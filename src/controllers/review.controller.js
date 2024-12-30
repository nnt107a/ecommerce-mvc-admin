"use strict";
const ReviewService = require("../services/review.service");
class ReviewController {
  getReview = async (req, res) => {
    try {
      const result = await ReviewService.reviewsByProductId(req.params.id);

      if (!result) {
        return res.status(404).json({ message: "Not Found" });
      }
      return res.status(200).json(result);
    } catch (error) {
      return res.status(error.status).json({ message: error.message });
    }
  };
  createReview = async (req, res) => {
    const { comment, star } = req.body;
    console.log("createReview", comment, star);
    const userId = req.session.userId;
    try {
      const result = await ReviewService.createUserReview(
        req.params.id,
        comment,
        star,
        userId
      );
      return res.status(200).json(result);
    } catch (error) {
      console.log("controkker", error.message);
      return res.status(error.status).json({ message: error.message });
    }
  };
}
module.exports = new ReviewController();

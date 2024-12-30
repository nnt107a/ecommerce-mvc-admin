"use strict";
const ReviewController = require("../../controllers/review.controller");
const express = require("express");
const router = express.Router();

router.post("/reviews-create/:id", ReviewController.createReview);
router.get("/reviews-get-by-id/:id", ReviewController.getReview);

module.exports = router;

"use strict";
const OrderController = require("../../controllers/order.controller");
const express = require("express");
const {ensureAuthenticated} = require("../../middleware/authMiddleware");
const router = express.Router();

router.get("/order", ensureAuthenticated, OrderController.getOrder);
router.post("/checkout", ensureAuthenticated, OrderController.checkout);
router.post("/create-order", ensureAuthenticated, OrderController.createOrder);
router.get("/order/:id", ensureAuthenticated, OrderController.getDetail);

module.exports = router;
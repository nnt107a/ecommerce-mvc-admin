"use strict";
const OrderController = require("../../controllers/order.controller");
const express = require("express");
const {ensureAuthenticated} = require("../../middleware/authMiddleware");
const router = express.Router();

router.get("/order", ensureAuthenticated, OrderController.getOrder);
router.get("/order/:id", ensureAuthenticated, OrderController.getDetail);
router.post("/order/:id", ensureAuthenticated, OrderController.updateOrderStatus);

module.exports = router;
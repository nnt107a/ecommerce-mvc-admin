"use strict";
const ProductController = require("../../controllers/product.controller");
const express = require("express");
const { asyncHandler } = require("../../auth/checkAuth");
const { ensureAuthenticated } = require("../../middleware/authMiddleware");
const {createProduct, deleteByDate}= require("../../mock-data/generate-product")
const router = express.Router();
router.get("/product-create", createProduct);
router.get("/product-delete", deleteByDate);

router.get("/get-all", asyncHandler(ProductController.getAllProduct));
router.get("/get-by-id/:id", asyncHandler(ProductController.getProductById));
router.get("/home", ProductController.getHome);
router.get("/home/revenue", ensureAuthenticated, ProductController.getRevenueReport);
router.get("/home/top-product", ensureAuthenticated, ProductController.getTopRevenueProducts);
router.get("/shop", ProductController.getShop);
router.get("/detail/:id", ProductController.getDetail);

module.exports = router;

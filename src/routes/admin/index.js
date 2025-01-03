"use strict";
const AdminController = require("../../controllers/admin.controller");
const express = require("express");
const {ensureAuthenticated} = require("../../middleware/authMiddleware");
const router = express.Router();

router.get("/account", ensureAuthenticated, AdminController.getAccount);
router.get("/account/:id", ensureAuthenticated, AdminController.getDetail);
router.post("/account/:id", ensureAuthenticated, AdminController.updateStatus);

router.get("/manage-cate-manu", ensureAuthenticated, AdminController.getManageCateManu);
router.post("/add-category", ensureAuthenticated, AdminController.addCategory);
router.post("/add-manufacturer", ensureAuthenticated, AdminController.addManufacturer);

module.exports = router;

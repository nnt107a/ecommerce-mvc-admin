"use strict";
const AdminController = require("../../controllers/admin.controller");
const express = require("express");
const {ensureAuthenticated} = require("../../middleware/authMiddleware");
const router = express.Router();

router.get("/account", ensureAuthenticated, AdminController.getAccount);
router.get("/account/:id", ensureAuthenticated, AdminController.getDetail);
router.post("/account/:id", ensureAuthenticated, AdminController.updateStatus);

module.exports = router;

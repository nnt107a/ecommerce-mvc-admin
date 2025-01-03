"use strict";
const { apiKey, permission } = require("../auth/checkAuth");

const express = require("express");
const router = express.Router();
// router.use(apiKey);
// router.use(permission("0000")); // Truyền đúng tham số permission

router.use("", require("./access"));
router.use("", require("./product"));
router.use("", require("./order"));
router.use("", require("./review"));
router.use("", require("./admin"));

module.exports = router;

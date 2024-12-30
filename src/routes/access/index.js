"use strict";
const express = require("express");
const passport = require("passport");
const AccessController = require("../../controllers/access.controller");
const AccessService = require("../../services/access.service");
const { validateSignUp, validateSignIn } = require("../../middleware/validate");
const { customerStrategy } = require("../../auth/authUtils");
const { ensureAuthenticated } = require("../../middleware/authMiddleware");
const router = express.Router();
passport.use(customerStrategy);

passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    cb(null, { id: user.id });
  });
});
passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

router.get("/register", AccessController.getRegister);
router.post("/register", validateSignUp, AccessController.signUp);
router.post("/login/password", AccessController.login);
router.get("/login", AccessController.getLogin);
router.post("/logout", AccessController.logOut);

router.get("/profile", ensureAuthenticated, AccessController.getProfile);
router.post("/update-profile", AccessController.updateProfile);

// Route for changing password
router.get("/change-password", AccessController.getChangePassword);
router.post("/change-password", AccessController.changePassword);

router.get("/email-verify", AccessController.getVerificationpage);
router.post("/email-verify", AccessController.verifyEmail);
router.post("/email-resendVerify", AccessController.resendVerifycation)

module.exports = router;

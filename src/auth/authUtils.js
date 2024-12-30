"use strict";
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const { findByEmail } = require("../services/customer.service"); // Adjust the path as needed
///Looi
const customerStrategy = new LocalStrategy(
  { usernameField: "email", passwordField: "password" },

  async function verify(email, password, cb) {
    try {
      const foundCustomer = await findByEmail({ email });
      if (!foundCustomer) {
        console.log("Customer not registered.");
        return cb(null, false, { message: "Customer is not registered." });
      }

      const match = await bcrypt.compare(password, foundCustomer.password);
      if (!match) {
        console.log("Incorrect email or password.");
        return cb(null, false, { message: "Incorrect email or password." });
      }

      console.log("Customer authenticated successfully.");
      return cb(null, foundCustomer);
    } catch (err) {
      return cb(err);
    }
  }
);

module.exports = { customerStrategy };

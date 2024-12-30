"use strict";
const { findById } = require("../services/apikey.service");
const HEADER = {
  API_KEY: "x-api-key",
  AUTHORIZATION: "authorization",
};
const apiKey = async (req, res, next) => {
  try {
    const key = req.headers[HEADER.API_KEY]?.toString();
    if (!key) {
      return res.status(403).json({ message: "Forbidden Error" });
    }
    const objKey = await findById(key);
    if (!objKey) {
      return res.status(403).json({ message: "Forbidden Error" });
    }

    req.objKey = objKey;
    return next();
  } catch (e) {
    console.log(e);
  }
};
const permission = (permission) => {
  return (req, res, next) => {
    try {
      if (!req.objKey.permissions) {
        return res.status(403).json({ message: "Permission error" });
      }
      const permissionValue = req.objKey.permissions.includes(permission);
      if (!permissionValue) {
        return res.status(403).json({ message: "Permission error" });
      }

      return next();
    } catch (e) {
      console.log(e);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };
};
const asyncHandler = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};
module.exports = { apiKey, permission, asyncHandler };

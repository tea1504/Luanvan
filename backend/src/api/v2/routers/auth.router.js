const express = require("express");
const Constants = require("../constants");
const authController = require("./../controllers/auth.controller");
const route = express.Router();
const authMiddleware = require("./../middlewares/auth.middleware");

route.post(Constants.ApiPath.Auth.LOGIN, authController.login);
route.get(
  Constants.ApiPath.Auth.GET_INFO,
  authMiddleware,
  authController.getInfo
);

module.exports = route;

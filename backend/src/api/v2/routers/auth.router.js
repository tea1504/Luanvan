const express = require("express");
const Constants = require("../constants");
const authController = require("./../controllers/auth.controller");
const route = express.Router();
const authMiddleware = require("./../middlewares/auth.middleware");
const multer = require("multer");
const path = require("path");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join("public/avatars/"));
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "_" + Date.now() + "." + file.originalname.split(".")[1]
    );
  },
});

var upload = multer({ storage: storage });

route.post(Constants.ApiPath.Auth.LOGIN, authController.login);
route.get(
  Constants.ApiPath.Auth.GET_INFO,
  authMiddleware,
  authController.getInfo
);
route.post(
  Constants.ApiPath.Auth.PUT_INFO,
  authMiddleware,
  upload.single("avatar"),
  authController.putInfo
);

module.exports = route;

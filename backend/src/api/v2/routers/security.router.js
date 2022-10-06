const express = require("express");
const Constants = require("../constants");
const route = express.Router();
const securityController = require("./../controllers/security.controller");
const multer = require("multer");
const path = require("path");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join("public/uploads/"));
  },
  filename: function (req, file, cb) {
    console.log(file);
    cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
  },
});

var upload = multer({ storage: storage });

route.get(Constants.ApiPath.Security.SLASH, securityController.getSecurities);
route.get(Constants.ApiPath.Security.ID, securityController.getSecurity);
route.post(Constants.ApiPath.Security.SLASH, securityController.postSecurity);
route.post(
  Constants.ApiPath.Security.CREATE_MULTI,
  upload.single("file"),
  securityController.postSecurities
);
route.put(Constants.ApiPath.Security.ID, securityController.putSecurity);
route.delete(Constants.ApiPath.Security.ID, securityController.deleteSecurity);
route.delete(
  Constants.ApiPath.Security.SLASH,
  securityController.deleteSecurities
);

module.exports = route;

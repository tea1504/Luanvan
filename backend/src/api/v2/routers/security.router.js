const express = require("express");
const Constants = require("../constants");
const route = express.Router();
const securityController = require("./../controllers/security.controller");
const multer = require("multer");
const path = require("path");
const readCategories = require("../middlewares/readCategories.middleware");
const createCategories = require("../middlewares/createCategories.middleware");
const updateCategories = require("../middlewares/updateCategories.middleware");
const deleteCategories = require("../middlewares/deleteCategories.middleware");
const adminMiddleware = require("./../middlewares/admin.middleware");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join("public/uploads/"));
  },
  filename: function (req, file, cb) {
    var f = file.originalname.split(".");
    cb(null, file.fieldname + "_" + Date.now() + "." + f[f.length - 1]);
  },
});

var upload = multer({ storage: storage });

route.get(Constants.ApiPath.Security.LIST, securityController.getList);
route.get(
  Constants.ApiPath.Security.SLASH,
  adminMiddleware,
  readCategories,
  securityController.getSecurities
);
route.get(
  Constants.ApiPath.Security.ID,
  adminMiddleware,
  readCategories,
  securityController.getSecurity
);
route.post(
  Constants.ApiPath.Security.SLASH,
  adminMiddleware,
  createCategories,
  securityController.postSecurity
);
route.post(
  Constants.ApiPath.Security.CREATE_MULTI,
  adminMiddleware,
  createCategories,
  upload.single("file"),
  securityController.postSecurities
);
route.put(
  Constants.ApiPath.Security.ID,
  adminMiddleware,
  updateCategories,
  securityController.putSecurity
);
route.delete(
  Constants.ApiPath.Security.ID,
  adminMiddleware,
  deleteCategories,
  securityController.deleteSecurity
);
route.delete(
  Constants.ApiPath.Security.SLASH,
  adminMiddleware,
  deleteCategories,
  securityController.deleteSecurities
);

module.exports = route;

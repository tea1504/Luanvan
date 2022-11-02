const express = require("express");
const Constants = require("../constants");
const route = express.Router();
const organizationController = require("../controllers/organization.controller");
const multer = require("multer");
const path = require("path");
const readCategories = require("../middlewares/readCategories.middleware");
const createCategories = require("../middlewares/createCategories.middleware");
const updateCategories = require("../middlewares/updateCategories.middleware");
const deleteCategories = require("../middlewares/deleteCategories.middleware");
const admin = require("../middlewares/admin.middleware");

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

route.get(
  Constants.ApiPath.Organization.LIST,
  organizationController.getList
);
route.get(
  Constants.ApiPath.Organization.SLASH,
  admin,
  readCategories,
  organizationController.getMany
);
route.get(
  Constants.ApiPath.Organization.ORGAN_ID,
  admin,
  readCategories,
  organizationController.getManyByOrganId
);
route.get(
  Constants.ApiPath.Organization.ID,
  admin,
  readCategories,
  organizationController.getOne
);
route.post(
  Constants.ApiPath.Organization.SLASH,
  admin,
  createCategories,
  organizationController.postOne
);
route.post(
  Constants.ApiPath.Organization.CREATE_MULTI,
  admin,
  createCategories,
  upload.single("file"),
  organizationController.postMany
);
route.put(
  Constants.ApiPath.Organization.ID,
  admin,
  updateCategories,
  organizationController.putOne
);
route.delete(
  Constants.ApiPath.Organization.ID,
  admin,
  deleteCategories,
  organizationController.deleteOne
);
route.delete(
  Constants.ApiPath.Organization.SLASH,
  admin,
  deleteCategories,
  organizationController.deleteMany
);

module.exports = route;

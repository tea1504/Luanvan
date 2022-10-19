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

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join("public/uploads/"));
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "_" + Date.now() + "." + file.originalname.split(".")[1]
    );
  },
});

var upload = multer({ storage: storage });

route.get(
  Constants.ApiPath.Organization.SLASH,
  readCategories,
  organizationController.getMany
);
route.get(
  Constants.ApiPath.Organization.ORGAN_ID,
  readCategories,
  organizationController.getManyByOrganId
);
route.get(
  Constants.ApiPath.Organization.ID,
  readCategories,
  organizationController.getOne
);
route.post(
  Constants.ApiPath.Organization.SLASH,
  createCategories,
  organizationController.postOne
);
route.post(
  Constants.ApiPath.Organization.CREATE_MULTI,
  createCategories,
  upload.single("file"),
  organizationController.postMany
);
route.put(
  Constants.ApiPath.Organization.ID,
  updateCategories,
  organizationController.putOne
);
route.delete(
  Constants.ApiPath.Organization.ID,
  deleteCategories,
  organizationController.deleteOne
);
route.delete(
  Constants.ApiPath.Organization.SLASH,
  deleteCategories,
  organizationController.deleteMany
);

module.exports = route;

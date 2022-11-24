const express = require("express");
const Constants = require("../constants");
const route = express.Router();
const controller = require("../controllers/officerStatus.controller");

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
    var f = file.originalname.split(".");
    cb(null, file.fieldname + "_" + Date.now() + "." + f[f.length - 1]);
  },
});

var upload = multer({ storage: storage });
route.get(
  Constants.ApiPath.OfficerStatus.SLASH,
  readCategories,
  controller.getOfficerStatuses
);
route.get(
  Constants.ApiPath.OfficerStatus.LIST,
  readCategories,
  controller.getList
);
route.get(
  Constants.ApiPath.OfficerStatus.ID,
  readCategories,
  controller.getOfficerStatus
);
route.post(
  Constants.ApiPath.OfficerStatus.SLASH,
  createCategories,
  controller.postOfficerStatus
);
route.post(
  Constants.ApiPath.OfficerStatus.CREATE_MULTI,
  createCategories,
  upload.single("file"),
  controller.postOfficerStatuses
);
route.put(
  Constants.ApiPath.OfficerStatus.ID,
  updateCategories,
  controller.putOfficerStatus
);
route.delete(
  Constants.ApiPath.OfficerStatus.ID,
  deleteCategories,
  controller.deleteOfficerStatus
);
route.delete(
  Constants.ApiPath.OfficerStatus.SLASH,
  deleteCategories,
  controller.deleteOfficerStatuses
);

module.exports = route;

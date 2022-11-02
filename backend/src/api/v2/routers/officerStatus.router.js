const express = require("express");
const Constants = require("../constants");
const route = express.Router();
const officerStatusController = require("../controllers/officerStatus.controller");

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
  officerStatusController.getOfficerStatuses
);
route.get(
  Constants.ApiPath.OfficerStatus.ID,
  readCategories,
  officerStatusController.getOfficerStatus
);
route.post(
  Constants.ApiPath.OfficerStatus.SLASH,
  createCategories,
  officerStatusController.postOfficerStatus
);
route.post(
  Constants.ApiPath.OfficerStatus.CREATE_MULTI,
  createCategories,
  upload.single("file"),
  officerStatusController.postOfficerStatuses
);
route.put(
  Constants.ApiPath.OfficerStatus.ID,
  updateCategories,
  officerStatusController.putOfficerStatus
);
route.delete(
  Constants.ApiPath.OfficerStatus.ID,
  deleteCategories,
  officerStatusController.deleteOfficerStatus
);
route.delete(
  Constants.ApiPath.OfficerStatus.SLASH,
  deleteCategories,
  officerStatusController.deleteOfficerStatuses
);

module.exports = route;

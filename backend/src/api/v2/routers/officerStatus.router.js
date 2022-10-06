const express = require("express");
const Constants = require("../constants");
const route = express.Router();
const officerStatusController = require("../controllers/officerStatus.controller")

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
route.get(Constants.ApiPath.OfficerStatus.SLASH, officerStatusController.getOfficerStatuses);
route.get(Constants.ApiPath.OfficerStatus.ID, officerStatusController.getOfficerStatus);
route.post(Constants.ApiPath.OfficerStatus.SLASH, officerStatusController.postOfficerStatus);
route.post(
  Constants.ApiPath.OfficerStatus.CREATE_MULTI,
  upload.single("file"),
  officerStatusController.postOfficerStatuses
);
route.put(Constants.ApiPath.OfficerStatus.ID, officerStatusController.putOfficerStatus);
route.delete(Constants.ApiPath.OfficerStatus.ID, officerStatusController.deleteOfficerStatus);
route.delete(Constants.ApiPath.OfficerStatus.SLASH, officerStatusController.deleteOfficerStatuses);

module.exports = route;

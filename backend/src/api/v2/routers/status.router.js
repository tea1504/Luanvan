const express = require("express");
const Constants = require("../constants");
const route = express.Router();
const statusController = require("./../controllers/status.controller");
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

route.get(Constants.ApiPath.Status.SLASH, statusController.getStatuses);
route.get(Constants.ApiPath.Status.ID, statusController.getStatus);
route.post(Constants.ApiPath.Status.SLASH, statusController.postStatus);
route.post(
  Constants.ApiPath.Status.CREATE_MULTI,
  upload.single("file"),
  statusController.postStatuses
);
route.put(Constants.ApiPath.Status.ID, statusController.putStatus);
route.delete(Constants.ApiPath.Status.ID, statusController.deleteStatus);
route.delete(Constants.ApiPath.Status.SLASH, statusController.deleteStatuses);

module.exports = route;

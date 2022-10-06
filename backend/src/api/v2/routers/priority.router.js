const express = require("express");
const Constants = require("../constants");
const route = express.Router();
const priorityController = require("../controllers/priority.controller")
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

route.get(Constants.ApiPath.Priority.SLASH, priorityController.getPriorities);
route.get(Constants.ApiPath.Priority.ID, priorityController.getPriority);
route.post(Constants.ApiPath.Priority.SLASH, priorityController.postPriority);
route.post(
  Constants.ApiPath.Priority.CREATE_MULTI,
  upload.single("file"),
  priorityController.postPriorities
);
route.put(Constants.ApiPath.Priority.ID, priorityController.putPriority);
route.delete(Constants.ApiPath.Priority.ID, priorityController.deletePriority);
route.delete(Constants.ApiPath.Priority.SLASH, priorityController.deletePriorities);

module.exports = route;

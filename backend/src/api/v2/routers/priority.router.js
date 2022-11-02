const express = require("express");
const Constants = require("../constants");
const route = express.Router();
const priorityController = require("../controllers/priority.controller");
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
  Constants.ApiPath.Priority.SLASH,
  readCategories,
  priorityController.getPriorities
);
route.get(
  Constants.ApiPath.Priority.ID,
  readCategories,
  priorityController.getPriority
);
route.post(
  Constants.ApiPath.Priority.SLASH,
  createCategories,
  priorityController.postPriority
);
route.post(
  Constants.ApiPath.Priority.CREATE_MULTI,
  createCategories,
  upload.single("file"),
  priorityController.postPriorities
);
route.put(
  Constants.ApiPath.Priority.ID,
  updateCategories,
  priorityController.putPriority
);
route.delete(
  Constants.ApiPath.Priority.ID,
  deleteCategories,
  priorityController.deletePriority
);
route.delete(
  Constants.ApiPath.Priority.SLASH,
  deleteCategories,
  priorityController.deletePriorities
);

module.exports = route;

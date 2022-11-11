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

route.get(
  Constants.ApiPath.Priority.LIST,
  readCategories,
  priorityController.getList
);
route.get(
  Constants.ApiPath.Priority.SLASH,
  adminMiddleware,
  readCategories,
  priorityController.getPriorities
);
route.get(
  Constants.ApiPath.Priority.ID,
  adminMiddleware,
  readCategories,
  priorityController.getPriority
);
route.post(
  Constants.ApiPath.Priority.SLASH,
  adminMiddleware,
  createCategories,
  priorityController.postPriority
);
route.post(
  Constants.ApiPath.Priority.CREATE_MULTI,
  adminMiddleware,
  createCategories,
  upload.single("file"),
  priorityController.postPriorities
);
route.put(
  Constants.ApiPath.Priority.ID,
  adminMiddleware,
  updateCategories,
  priorityController.putPriority
);
route.delete(
  Constants.ApiPath.Priority.ID,
  adminMiddleware,
  deleteCategories,
  priorityController.deletePriority
);
route.delete(
  Constants.ApiPath.Priority.SLASH,
  adminMiddleware,
  deleteCategories,
  priorityController.deletePriorities
);

module.exports = route;

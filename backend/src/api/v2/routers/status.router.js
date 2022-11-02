const express = require("express");
const Constants = require("../constants");
const route = express.Router();
const controller = require("./../controllers/status.controller");
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
    cb(
      null,
      file.fieldname + "_" + Date.now() + "." + file.originalname.split(".")[1]
    );
  },
});

var upload = multer({ storage: storage });

route.get(
  Constants.ApiPath.Status.LIST,
  controller.getList
);
route.get(
  Constants.ApiPath.Status.SLASH,
  adminMiddleware,
  readCategories,
  controller.getStatuses
);
route.get(
  Constants.ApiPath.Status.ID,
  adminMiddleware,
  readCategories,
  controller.getStatus
);
route.post(
  Constants.ApiPath.Status.SLASH,
  adminMiddleware,
  createCategories,
  controller.postStatus
);
route.post(
  Constants.ApiPath.Status.CREATE_MULTI,
  adminMiddleware,
  createCategories,
  upload.single("file"),
  controller.postStatuses
);
route.put(
  Constants.ApiPath.Status.ID,
  adminMiddleware,
  updateCategories,
  controller.putStatus
);
route.delete(
  Constants.ApiPath.Status.ID,
  adminMiddleware,
  deleteCategories,
  controller.deleteStatus
);
route.delete(
  Constants.ApiPath.Status.SLASH,
  adminMiddleware,
  deleteCategories,
  controller.deleteStatuses
);

module.exports = route;

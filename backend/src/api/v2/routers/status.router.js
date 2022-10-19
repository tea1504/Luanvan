const express = require("express");
const Constants = require("../constants");
const route = express.Router();
const statusController = require("./../controllers/status.controller");
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
  Constants.ApiPath.Status.SLASH,
  readCategories,
  statusController.getStatuses
);
route.get(
  Constants.ApiPath.Status.ID,
  readCategories,
  statusController.getStatus
);
route.post(
  Constants.ApiPath.Status.SLASH,
  createCategories,
  statusController.postStatus
);
route.post(
  Constants.ApiPath.Status.CREATE_MULTI,
  createCategories,
  upload.single("file"),
  statusController.postStatuses
);
route.put(
  Constants.ApiPath.Status.ID,
  updateCategories,
  statusController.putStatus
);
route.delete(
  Constants.ApiPath.Status.ID,
  deleteCategories,
  statusController.deleteStatus
);
route.delete(
  Constants.ApiPath.Status.SLASH,
  deleteCategories,
  statusController.deleteStatuses
);

module.exports = route;

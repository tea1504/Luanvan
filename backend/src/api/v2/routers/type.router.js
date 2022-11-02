const express = require("express");
const Constants = require("../constants");
const route = express.Router();
const typeController = require("./../controllers/type.controller");
const multer = require("multer");
const path = require("path");
const readCategories = require("../middlewares/readCategories.middleware");
const createCategories = require("../middlewares/createCategories.middleware");
const updateCategories = require("../middlewares/updateCategories.middleware");
const deleteCategories = require("../middlewares/deleteCategories.middleware");
const adminMiddleware = require("../middlewares/admin.middleware");

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

route.get(Constants.ApiPath.Type.LIST, typeController.getList);
route.get(
  Constants.ApiPath.Type.SLASH,
  adminMiddleware,
  readCategories,
  typeController.getTypes
);
route.get(
  Constants.ApiPath.Type.ID,
  adminMiddleware,
  readCategories,
  typeController.getType
);
route.post(
  Constants.ApiPath.Type.SLASH,
  adminMiddleware,
  createCategories,
  typeController.post
);
route.post(
  Constants.ApiPath.Type.CREATE_MULTI,
  adminMiddleware,
  createCategories,
  upload.single("file"),
  typeController.postTypes
);
route.put(Constants.ApiPath.Type.ID, updateCategories, typeController.putType);
route.delete(
  Constants.ApiPath.Type.ID,
  adminMiddleware,
  deleteCategories,
  typeController.deleteType
);
route.delete(
  Constants.ApiPath.Type.SLASH,
  adminMiddleware,
  deleteCategories,
  typeController.deleteTypes
);

module.exports = route;

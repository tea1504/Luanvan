const express = require("express");
const Constants = require("../constants");
const route = express.Router();
const languageController = require("./../controllers/language.controller");
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

route.get(Constants.ApiPath.Language.LIST, languageController.getList);
route.get(
  Constants.ApiPath.Language.SLASH,
  adminMiddleware,
  readCategories,
  languageController.getLanguages
);
route.get(
  Constants.ApiPath.Language.ID,
  adminMiddleware,
  readCategories,
  languageController.getLanguage
);
route.post(
  Constants.ApiPath.Language.SLASH,
  adminMiddleware,
  createCategories,
  languageController.postLanguage
);
route.post(
  Constants.ApiPath.Language.CREATE_MULTI,
  adminMiddleware,
  createCategories,
  upload.single("file"),
  languageController.postLanguages
);
route.put(
  Constants.ApiPath.Language.ID,
  adminMiddleware,
  updateCategories,
  languageController.putLanguage
);
route.delete(
  Constants.ApiPath.Language.ID,
  adminMiddleware,
  deleteCategories,
  languageController.deleteLanguage
);
route.delete(
  Constants.ApiPath.Language.SLASH,
  adminMiddleware,
  deleteCategories,
  languageController.deleteLanguages
);

module.exports = route;

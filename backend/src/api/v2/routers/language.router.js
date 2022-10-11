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

route.get(
  Constants.ApiPath.Language.SLASH,
  readCategories,
  languageController.getLanguages
);
route.get(
  Constants.ApiPath.Language.ID,
  readCategories,
  languageController.getLanguage
);
route.post(
  Constants.ApiPath.Language.SLASH,
  createCategories,
  languageController.postLanguage
);
route.post(
  Constants.ApiPath.Language.CREATE_MULTI,
  createCategories,
  upload.single("file"),
  languageController.postLanguages
);
route.put(
  Constants.ApiPath.Language.ID,
  updateCategories,
  languageController.putLanguage
);
route.delete(
  Constants.ApiPath.Language.ID,
  deleteCategories,
  languageController.deleteLanguage
);
route.delete(
  Constants.ApiPath.Language.SLASH,
  deleteCategories,
  languageController.deleteLanguages
);

module.exports = route;

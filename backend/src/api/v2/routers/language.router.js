const express = require("express");
const Constants = require("../constants");
const route = express.Router();
const languageController = require("./../controllers/language.controller");
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

route.get(Constants.ApiPath.Language.SLASH, languageController.getLanguages);
route.post(Constants.ApiPath.Language.SLASH, languageController.postLanguage);
route.post(
  Constants.ApiPath.Language.CREATE_MULTI,
  upload.single("file"),
  languageController.postLanguages
);
route.get(Constants.ApiPath.Language.ID, languageController.getLanguage);
route.put(Constants.ApiPath.Language.ID, languageController.putLanguage);
route.delete(Constants.ApiPath.Language.ID, languageController.deleteLanguage);
route.delete(
  Constants.ApiPath.Language.SLASH,
  languageController.deleteLanguages
);

module.exports = route;

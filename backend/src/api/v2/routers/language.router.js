const express = require("express");
const Constants = require("../constants");
const route = express.Router();
const languageController = require("./../controllers/language.controller");

route.get(Constants.ApiPath.Language.SLASH, languageController.getLanguages);
route.post(Constants.ApiPath.Language.SLASH, languageController.postLanguage);
route.get(Constants.ApiPath.Language.ID, languageController.getLanguage);
route.put(Constants.ApiPath.Language.ID, languageController.putLanguage);
route.delete(Constants.ApiPath.Language.ID, languageController.deleteLanguage);
route.delete(Constants.ApiPath.Language.SLASH, languageController.deleteLanguages);

module.exports = route;

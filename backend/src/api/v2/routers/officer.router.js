const express = require("express");
const Constants = require("../constants");
const route = express.Router();
const controller = require("../controllers/officer.controller");
const multer = require("multer");
const path = require("path");
const readCategories = require("../middlewares/readCategories.middleware");
const createCategories = require("../middlewares/createCategories.middleware");
const updateCategories = require("../middlewares/updateCategories.middleware");
const deleteCategories = require("../middlewares/deleteCategories.middleware");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === "file") cb(null, path.join("public/uploads/"));
    else cb(null, path.join("public/avatars/"));
  },
  filename: function (req, file, cb) {
    var f = file.originalname.split(".");
    cb(null, file.fieldname + "_" + Date.now() + "." + f[f.length - 1]);
  },
});

var upload = multer({ storage: storage });

route.get(Constants.ApiPath.Officers.SLASH, readCategories, controller.getMany);
route.get(
  Constants.ApiPath.Officers.ORGAN_ID,
  readCategories,
  controller.getManyByOrganId
);
route.get(
  Constants.ApiPath.Officers.USER_ID,
  readCategories,
  controller.getManyByUser
);
route.get(Constants.ApiPath.Officers.ID, readCategories, controller.getOne);
route.post(
  Constants.ApiPath.Officers.SLASH,
  createCategories,
  upload.single("avatar"),
  controller.postOne
);
route.post(
  Constants.ApiPath.Officers.CREATE_MULTI,
  createCategories,
  upload.single("file"),
  controller.postMany
);
route.put(
  Constants.ApiPath.Officers.ID,
  updateCategories,
  upload.single("avatar"),
  controller.putOne
);
route.delete(
  Constants.ApiPath.Officers.ID,
  deleteCategories,
  controller.deleteOne
);
route.delete(
  Constants.ApiPath.Officers.SLASH,
  deleteCategories,
  controller.deleteMany
);

module.exports = route;

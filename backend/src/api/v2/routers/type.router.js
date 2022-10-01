const express = require("express");
const Constants = require("../constants");
const route = express.Router();
const typeController = require("./../controllers/type.controller");
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

route.get(Constants.ApiPath.Type.SLASH, typeController.getTypes);
route.post(Constants.ApiPath.Type.SLASH, typeController.post);
route.post(
  Constants.ApiPath.Type.CREATE_MULTI,
  upload.single("file"),
  typeController.postTypes
);
route.get(Constants.ApiPath.Type.ID, typeController.getType);
route.put(Constants.ApiPath.Type.ID, typeController.putType);
route.delete(Constants.ApiPath.Type.ID, typeController.deleteType);
route.delete(Constants.ApiPath.Type.SLASH, typeController.deleteTypes);

module.exports = route;

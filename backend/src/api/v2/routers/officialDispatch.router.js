const express = require("express");
const Constants = require("../constants");
const route = express.Router();
const multer = require("multer");
const path = require("path");
const controller = require("../controllers/officialDispatch.controller");
const createOD = require("../middlewares/createOD.middleware");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join("public/temp/"));
  },
  filename: function (req, file, cb) {
    var f = file.originalname.split(".");
    cb(null, file.fieldname + "_" + Date.now() + "." + f[f.length - 1]);
  },
});

var upload = multer({ storage: storage });

route.post(
  Constants.ApiPath.OfficialDispatch.PROCESS,
  createOD,
  upload.single("file"),
  controller.processOD
);

module.exports = route;

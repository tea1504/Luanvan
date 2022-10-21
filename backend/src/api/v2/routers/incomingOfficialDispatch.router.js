const express = require("express");
const Constants = require("../constants");
const route = express.Router();
const multer = require("multer");
const path = require("path");
const controller = require("./../controllers/incomingOfficialDispatch.controller")
const readOD = require("../middlewares/readOD.middleware")


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
  Constants.ApiPath.Language.SLASH,
  readOD,
  controller.getManyByUserOrgan
);

module.exports = route;

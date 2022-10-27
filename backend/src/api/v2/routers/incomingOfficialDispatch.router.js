const express = require("express");
const Constants = require("../constants");
const route = express.Router();
const multer = require("multer");
const path = require("path");
const controller = require("./../controllers/incomingOfficialDispatch.controller")
const readOD = require("../middlewares/readOD.middleware")
const createOD = require("../middlewares/createOD.middleware")


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
  Constants.ApiPath.IncomingOfficialDispatch.SLASH,
  readOD,
  controller.getManyByUserOrgan
);
route.get(
  Constants.ApiPath.IncomingOfficialDispatch.FILE,
  readOD,
  controller.getFile
);
route.get(
  Constants.ApiPath.IncomingOfficialDispatch.GET_ARRIVAL_NUMBER,
  createOD,
  controller.getNewArrivalNumber
);
route.get(
  Constants.ApiPath.IncomingOfficialDispatch.ID,
  readOD,
  controller.getOne
);

module.exports = route;

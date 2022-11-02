const express = require("express");
const Constants = require("../constants");
const route = express.Router();
const multer = require("multer");
const path = require("path");
const controller = require("./../controllers/incomingOfficialDispatch.controller");
const readOD = require("../middlewares/readOD.middleware");
const createOD = require("../middlewares/createOD.middleware");
const approveOD = require("../middlewares/approveOD.middleware");
var fs = require("fs");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (req.body.security == "undefined") req.body.security = "";
    if (!fs.existsSync("public/uploads/" + req.body.security)) {
      fs.mkdirSync("public/uploads/" + req.body.security);
    }
    cb(null, path.join("public/uploads/", req.body.security));
  },
  filename: function (req, file, cb) {
    var f = file.originalname.split(".");
    cb(null, file.fieldname + "_" + Date.now() + "." + f[f.length - 1]);
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
route.post(
  Constants.ApiPath.IncomingOfficialDispatch.SLASH,
  createOD,
  upload.array("file"),
  controller.postOne
);
route.put(
  Constants.ApiPath.IncomingOfficialDispatch.APPROVAL,
  approveOD,
  controller.approval
);

module.exports = route;

const express = require("express");
const Constants = require("../constants");
const route = express.Router();
const multer = require("multer");
const path = require("path");
const controller = require("../controllers/officialDispatchTravel.controller");
const readOD = require("../middlewares/readOD.middleware");
const createOD = require("../middlewares/createOD.middleware");
const approveOD = require("../middlewares/approveOD.middleware");
const deleteOD = require("../middlewares/deleteOD.middleware");
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
  Constants.ApiPath.OfficialDispatchTravel.STATISTIC_YEAR_MONTH_TYPE,
  createOD,
  controller.getStatisticTypeYear
);
route.get(
  Constants.ApiPath.OfficialDispatchTravel.STATISTIC_YEAR_MONTH,
  createOD,
  controller.getStatisticYearPerMonth
);
route.get(
  Constants.ApiPath.OfficialDispatchTravel.STATISTIC_MONTH_DATE,
  createOD,
  controller.getStatisticMonth
);
route.get(
  Constants.ApiPath.OfficialDispatchTravel.REPORT,
  createOD,
  controller.report
);
route.get(
  Constants.ApiPath.OfficialDispatchTravel.REPORT_YEAR,
  controller.getYearReport
);
route.get(
  Constants.ApiPath.OfficialDispatchTravel.SLASH,
  readOD,
  controller.getManyByUserOrgan
);
route.get(
  Constants.ApiPath.OfficialDispatchTravel.FILE,
  readOD,
  controller.getFile
);
route.get(
  Constants.ApiPath.OfficialDispatchTravel.GET_NEW_CODE,
  approveOD,
  controller.getNewCode
);
route.get(
  Constants.ApiPath.OfficialDispatchTravel.ID,
  readOD,
  controller.getOne
);
route.post(
  Constants.ApiPath.OfficialDispatchTravel.SLASH,
  createOD,
  upload.array("file"),
  controller.postOne
);
route.put(
  Constants.ApiPath.OfficialDispatchTravel.ID,
  upload.array("file"),
  controller.putOne
);
route.put(
  Constants.ApiPath.OfficialDispatchTravel.APPROVAL,
  approveOD,
  controller.approval
);
route.put(
  Constants.ApiPath.OfficialDispatchTravel.APPROVAL_CANCEL,
  approveOD,
  controller.cancelApproval
);
route.put(
  Constants.ApiPath.OfficialDispatchTravel.HANDLE,
  upload.array("newFile"),
  controller.handle
);
route.put(
  Constants.ApiPath.OfficialDispatchTravel.REFUSE,
  approveOD,
  controller.refuse
);
route.put(
  Constants.ApiPath.OfficialDispatchTravel.IMPLEMENT,
  approveOD,
  controller.implement
);
route.delete(Constants.ApiPath.Officers.ID, deleteOD, controller.deleteOne);
route.delete(Constants.ApiPath.Officers.SLASH, deleteOD, controller.deleteMany);

module.exports = route;

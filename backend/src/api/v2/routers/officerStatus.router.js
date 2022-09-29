const express = require("express");
const Constants = require("../constants");
const route = express.Router();
const officerStatusController = require("../controllers/officerStatus.controller")

route.get(Constants.ApiPath.OfficerStatus.SLASH, officerStatusController.getOfficerStatuses);
route.get(Constants.ApiPath.OfficerStatus.ID, officerStatusController.getOfficerStatus);
route.post(Constants.ApiPath.OfficerStatus.SLASH, officerStatusController.postOfficerStatus);
route.put(Constants.ApiPath.OfficerStatus.ID, officerStatusController.putOfficerStatus);
route.delete(Constants.ApiPath.OfficerStatus.ID, officerStatusController.deleteOfficerStatus);
route.delete(Constants.ApiPath.OfficerStatus.SLASH, officerStatusController.deleteOfficerStatuses);

module.exports = route;

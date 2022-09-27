const express = require("express");
const Constants = require("../constants");
const officerController = require("./../controllers/officer.controller");
const route = express.Router();

route.get(Constants.ApiPath.Officer.GET_OFFICERS, officerController.getOfficer);

module.exports = route;

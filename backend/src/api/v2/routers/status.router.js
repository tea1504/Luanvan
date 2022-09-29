const express = require("express");
const Constants = require("../constants");
const route = express.Router();
const statusController = require("./../controllers/status.controller");

route.get(Constants.ApiPath.Status.SLASH, statusController.getStatuses);
route.get(Constants.ApiPath.Status.ID, statusController.getStatus);
route.post(Constants.ApiPath.Status.SLASH, statusController.postStatus);
route.put(Constants.ApiPath.Status.ID, statusController.putStatus);
route.delete(Constants.ApiPath.Status.ID, statusController.deleteStatus);
route.delete(Constants.ApiPath.Status.SLASH, statusController.deleteStatuses);

module.exports = route;

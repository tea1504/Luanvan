const express = require("express");
const Constants = require("../constants");
const route = express.Router();
const priorityController = require("../controllers/priority.controller")

route.get(Constants.ApiPath.Priority.SLASH, priorityController.getPriorities);
route.get(Constants.ApiPath.Priority.ID, priorityController.getPriority);
route.post(Constants.ApiPath.Priority.SLASH, priorityController.postPriority);
route.put(Constants.ApiPath.Priority.ID, priorityController.putPriority);
route.delete(Constants.ApiPath.Priority.ID, priorityController.deletePriority);
route.delete(Constants.ApiPath.Priority.SLASH, priorityController.deletePriorities);

module.exports = route;

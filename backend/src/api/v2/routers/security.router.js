const express = require("express");
const Constants = require("../constants");
const route = express.Router();
const securityController = require("./../controllers/security.controller");

route.get(Constants.ApiPath.Security.SLASH, securityController.getSecurities);
route.get(Constants.ApiPath.Security.ID, securityController.getSecurity);
route.post(Constants.ApiPath.Security.SLASH, securityController.postSecurity);
route.put(Constants.ApiPath.Security.ID, securityController.putSecurity);
route.delete(Constants.ApiPath.Security.ID, securityController.deleteSecurity);
route.delete(Constants.ApiPath.Security.SLASH, securityController.deleteSecurities);

module.exports = route;

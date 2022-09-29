const express = require("express");
const Constants = require("../constants");
const route = express.Router();
const typeController = require("./../controllers/type.controller");

route.get(Constants.ApiPath.Type.SLASH, typeController.getTypes);
route.post(Constants.ApiPath.Type.SLASH, typeController.post);
route.get(Constants.ApiPath.Type.ID, typeController.getType);
route.put(Constants.ApiPath.Type.ID, typeController.putType);
route.delete(Constants.ApiPath.Type.ID, typeController.deleteType);
route.delete(Constants.ApiPath.Type.SLASH, typeController.deleteTypes);

module.exports = route;

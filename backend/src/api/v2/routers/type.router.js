const express = require("express");
const Constants = require("../constants");
const route = express.Router();
const typeController = require("./../controllers/type.controller");

route.get(Constants.ApiPath.Type.GET_TYPES, typeController.getTypes);
route.post(Constants.ApiPath.Type.GET_TYPES, typeController.post);
route.get(Constants.ApiPath.Type.GET_TYPE, typeController.getType);
route.put(Constants.ApiPath.Type.PUT_TYPE, typeController.putType);
route.delete(Constants.ApiPath.Type.DELETE_TYPE, typeController.deleteType);

module.exports = route;

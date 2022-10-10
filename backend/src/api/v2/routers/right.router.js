const express = require("express");
const Constants = require("../constants");
const route = express.Router();
const controller = require("./../controllers/right.controller");

route.get(Constants.ApiPath.Right.SLASH, controller.getMany);
route.get(Constants.ApiPath.Right.GET_MAX_CODE, controller.getMaxCode);
route.get(Constants.ApiPath.Right.ID, controller.getOne);
route.post(Constants.ApiPath.Right.SLASH, controller.postOne);
route.put(Constants.ApiPath.Right.ID, controller.putOne);
route.delete(Constants.ApiPath.Right.ID, controller.deleteOne);
route.delete(Constants.ApiPath.Right.SLASH, controller.deleteMany);

module.exports = route;

const express = require("express");
const Constants = require("../constants");
const route = express.Router();
const typeController = require("./../controllers/type.controller");

route.get(Constants.ApiPath.Type.GET_TYPES, typeController.get);

module.exports = route;

const express = require("express");
const Constants = require("../constants");
const createRight = require("../middlewares/createRight.middleware");
const deleteRight = require("../middlewares/deleteRight.middleware");
const readRight = require("../middlewares/readRight.middleware");
const updateRight = require("../middlewares/updateRight.middleware");
const route = express.Router();
const controller = require("./../controllers/right.controller");

route.get(Constants.ApiPath.Right.SLASH, readRight, controller.getMany);
route.get(Constants.ApiPath.Right.ID, readRight, controller.getOne);
route.post(Constants.ApiPath.Right.SLASH, createRight, controller.postOne);
route.put(Constants.ApiPath.Right.ID, updateRight, controller.putOne);
route.delete(Constants.ApiPath.Right.ID, deleteRight, controller.deleteOne);
route.delete(Constants.ApiPath.Right.SLASH, deleteRight, controller.deleteMany);

module.exports = route;

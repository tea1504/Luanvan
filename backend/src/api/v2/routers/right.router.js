const express = require("express");
const Constants = require("../constants");
const createRight = require("../middlewares/createRight.middleware");
const deleteRight = require("../middlewares/deleteRight.middleware");
const readRight = require("../middlewares/readRight.middleware");
const updateRight = require("../middlewares/updateRight.middleware");
const route = express.Router();
const controller = require("./../controllers/right.controller");
const adminMiddleware = require("./../middlewares/admin.middleware");

route.get(Constants.ApiPath.Organization.LIST, controller.getList);
route.get(
  Constants.ApiPath.Right.SLASH,
  adminMiddleware,
  readRight,
  controller.getMany
);
route.get(
  Constants.ApiPath.Right.ID,
  adminMiddleware,
  readRight,
  controller.getOne
);
route.post(
  Constants.ApiPath.Right.SLASH,
  adminMiddleware,
  createRight,
  controller.postOne
);
route.put(
  Constants.ApiPath.Right.ID,
  adminMiddleware,
  updateRight,
  controller.putOne
);
route.delete(
  Constants.ApiPath.Right.ID,
  adminMiddleware,
  deleteRight,
  controller.deleteOne
);
route.delete(
  Constants.ApiPath.Right.SLASH,
  adminMiddleware,
  deleteRight,
  controller.deleteMany
);

module.exports = route;

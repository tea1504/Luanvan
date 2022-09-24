const express = require("express");
const userController = require("./../controllers/user.controller");
const route = express.Router();
const authMiddleware = require("./../middlewares/auth.middleware");

route.post("/login", userController.login);
route.get("/", authMiddleware, userController.getInfo);
route.post("/update", authMiddleware, userController.updateInfo);

module.exports = route;

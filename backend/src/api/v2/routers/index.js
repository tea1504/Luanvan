const express = require("express");
const Constants = require("../constants");
const authRouter = require("./auth.router");
const officerRouter = require("./officer.router");
const route = express.Router();
const authMiddleware = require("./../middlewares/auth.middleware");

route.use(Constants.ApiPath.Auth.ROOT, authRouter);
route.use(Constants.ApiPath.Officer.ROOT, authMiddleware, officerRouter);

module.exports = route;

const express = require("express");
const Constants = require("../constants");
const authRouter = require("./auth.router");
const officerRouter = require("./officer.router");
const typeRouter = require("./type.router");
const statusRouter = require("./status.router");
const securityRouter = require("./security.router");
const priorityRouter = require("./priority.router");
const languageRouter = require("./language.router");
const officerStatusRouter = require("./officerStatus.router");
const rightRouter = require("./right.router");
const organizationRouter = require("./organization.router");
const route = express.Router();
const authMiddleware = require("./../middlewares/auth.middleware");
const adminMiddleware = require("./../middlewares/admin.middleware");

route.use(Constants.ApiPath.Auth.ROOT, authRouter);
route.use(Constants.ApiPath.Officer.ROOT, authMiddleware, officerRouter);
route.use(
  Constants.ApiPath.Type.ROOT,
  authMiddleware,
  adminMiddleware,
  typeRouter
);
route.use(
  Constants.ApiPath.Status.ROOT,
  authMiddleware,
  adminMiddleware,
  statusRouter
);
route.use(
  Constants.ApiPath.Security.ROOT,
  authMiddleware,
  adminMiddleware,
  securityRouter
);
route.use(
  Constants.ApiPath.Priority.ROOT,
  authMiddleware,
  adminMiddleware,
  priorityRouter
);
route.use(
  Constants.ApiPath.Language.ROOT,
  authMiddleware,
  adminMiddleware,
  languageRouter
);
route.use(
  Constants.ApiPath.OfficerStatus.ROOT,
  authMiddleware,
  adminMiddleware,
  officerStatusRouter
);
route.use(
  Constants.ApiPath.Right.ROOT,
  authMiddleware,
  adminMiddleware,
  rightRouter
);
route.use(
  Constants.ApiPath.Organization.ROOT,
  authMiddleware,
  adminMiddleware,
  organizationRouter
);

module.exports = route;

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
const IODRouter = require("./incomingOfficialDispatch.router");
const ODTRouter = require("./officialDispatchTravel.router");
const ODRouter = require("./officialDispatch.router");
const route = express.Router();
const authMiddleware = require("./../middlewares/auth.middleware");
const adminMiddleware = require("./../middlewares/admin.middleware");

route.use(Constants.ApiPath.Auth.ROOT, authRouter);
route.use(Constants.ApiPath.Officer.ROOT, authMiddleware, officerRouter);
route.use(
  Constants.ApiPath.Type.ROOT,
  authMiddleware,
  typeRouter
);
route.use(
  Constants.ApiPath.Status.ROOT,
  authMiddleware,
  statusRouter
);
route.use(
  Constants.ApiPath.Security.ROOT,
  authMiddleware,
  securityRouter
);
route.use(
  Constants.ApiPath.Priority.ROOT,
  authMiddleware,
  priorityRouter
);
route.use(
  Constants.ApiPath.Language.ROOT,
  authMiddleware,
  languageRouter
);
route.use(
  Constants.ApiPath.OfficerStatus.ROOT,
  authMiddleware,
  officerStatusRouter
);
route.use(
  Constants.ApiPath.Right.ROOT,
  authMiddleware,
  rightRouter
);
route.use(
  Constants.ApiPath.Organization.ROOT,
  authMiddleware,
  organizationRouter
);
route.use(
  Constants.ApiPath.Officers.ROOT,
  authMiddleware,
  officerRouter
);
route.use(
  Constants.ApiPath.IncomingOfficialDispatch.ROOT,
  authMiddleware,
  IODRouter
);
route.use(
  Constants.ApiPath.OfficialDispatchTravel.ROOT,
  authMiddleware,
  ODTRouter
);
route.use(Constants.ApiPath.OfficialDispatch.ROOT, authMiddleware, ODRouter);

module.exports = route;

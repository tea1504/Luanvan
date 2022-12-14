var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var v1Router = require("./src/api/v1/routers");
var v2Router = require("./src/api/v2/routers");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerJsDoc = YAML.load("./src/api/v2/v2.yml");
const authMiddleware = require("./src/api/v2/middlewares/auth.middleware");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/", indexRouter);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerJsDoc));
app.use("/users", usersRouter);
app.use("/v1", v1Router);
app.use("/v2", v2Router);

app.use(authMiddleware, express.static(path.join(__dirname, "public")));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  return next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  console.log("lỗi", err);
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  return res.status(err.status || 500).json({
    status: 500,
    message: "lỗi hệ thống 1",
    data: { error: err.message },
  });
});

module.exports = app;

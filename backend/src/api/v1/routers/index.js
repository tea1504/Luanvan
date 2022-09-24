const express = require("express");
const route = express.Router();
const bookRouter = require("./book.router");
const userRouter = require("./user.router");
const authMiddleware = require("./../middlewares/auth.middleware");
const { test } = require("../controllers/test.controller");

route.use("/books", authMiddleware, bookRouter);
route.use("/user", userRouter);
route.get("/test2", test);

module.exports = route;

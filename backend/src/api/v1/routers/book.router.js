const express = require("express");
const bookController= require("../controllers/book.controller");
const route = express.Router();

route.get("/", bookController.getBooks);
route.get("/:id", bookController.getBook);
route.post("/", bookController.addBook);
route.put("/:id", bookController.updateBook);
route.delete("/:id", bookController.deleteBook);

module.exports = route;

require("dotenv").config();
var mongoose = require("mongoose");

mongoose
  .connect(process.env.DATABASE)
  .then(() => console.log("Connected Successfully"))
  .catch((err) => console.error("Not Connected"));

const bookSchema = new mongoose.Schema(
  {
    bookId: { type: String, required: true },
    bookTitle: { type: String, required: true },
    bookAuthor: { type: String, required: true },
  },
  { collection: "book", timestamps: true }
);

module.exports = mongoose.model("books", bookSchema);

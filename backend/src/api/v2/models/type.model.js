require("dotenv").config();
var mongoose = require("mongoose");

mongoose.connect(process.env.DATABASE);

const typeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxLength: 100,
    },
    notation: {
      type: String,
      required: true,
      maxLength: 10,
    },
    description: {
      type: String,
      required: false,
      maxLength: 1000,
    },
    color: {
      type: String,
      required: true,
      minLength: 7,
      maxLength: 7,
      default: "#7ed6df",
    },
  },
  { collection: "types", timestamps: true }
);

module.exports = mongoose.model("types", typeSchema);

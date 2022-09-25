require("dotenv").config();
var mongoose = require("mongoose");
var databaseConfig = require("../../../config/database.config");

mongoose.connect(databaseConfig.v2.path);

const securitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxLength: 100,
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
  { collection: "securities", timestamps: true }
);

module.exports = mongoose.model("securities", securitySchema);

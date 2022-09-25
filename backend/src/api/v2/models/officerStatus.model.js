require("dotenv").config();
var mongoose = require("mongoose");
var databaseConfig = require("../../../config/database.config");

mongoose.connect(databaseConfig.v2.path);

const officerStatusSchema = new mongoose.Schema(
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
  { collection: "officerStatus", timestamps: true }
);

module.exports = mongoose.model("officerStatus", officerStatusSchema);

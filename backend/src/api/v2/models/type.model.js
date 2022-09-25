require("dotenv").config();
var mongoose = require("mongoose");
const databaseConfig = require("../../../config/database.config");
const Constants = require("../constants");

mongoose.connect(databaseConfig.v2.path);

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
      default: Constants.Styles.LIGHT_BLUE_COLOR,
    },
  },
  { collection: "types", timestamps: true }
);

module.exports = mongoose.model("types", typeSchema);

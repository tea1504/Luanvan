require("dotenv").config();
var mongoose = require("mongoose");
var databaseConfig = require("../../../config/database.config");
const Constants = require("../constants");

mongoose.connect(databaseConfig.v2.path);

const securitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [
        true,
        Constants.String.Message.REQUIRED(Constants.String.Security.NAME),
      ],
      maxLength: [
        100,
        Constants.String.Message.MAX_LENGTH(Constants.String.Security.NAME),
      ],
    },
    description: {
      type: String,
      required: false,
      maxLength: [
        1000,
        Constants.String.Message.MAX_LENGTH(
          Constants.String.Security.DESCRIPTION
        ),
      ],
    },
    color: {
      type: String,
      required: [
        true,
        Constants.String.Message.REQUIRED(Constants.String.Security.COLOR),
      ],
      minLength: [
        7,
        Constants.String.Message.MIN_LENGTH(Constants.String.Security.COLOR),
      ],
      maxLength: [
        7,
        Constants.String.Message.MAX_LENGTH(Constants.String.Security.COLOR),
      ],
      default: Constants.Styles.LIGHT_BLUE_COLOR,
    },
    deleted: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { collection: "securities", timestamps: true }
);

module.exports = mongoose.model("securities", securitySchema);

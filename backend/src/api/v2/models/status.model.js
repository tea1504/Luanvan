require("dotenv").config();
var mongoose = require("mongoose");
var databaseConfig = require("../../../config/database.config");
const Constants = require("../constants");

mongoose.connect(databaseConfig.v2.path);

const statusSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [
        true,
        Constants.String.Message.REQUIRED(Constants.String.Status.NAME),
      ],
      maxLength: [
        100,
        Constants.String.Message.MAX_LENGTH(Constants.String.Status.NAME),
      ],
    },
    description: {
      type: String,
      required: [
        true,
        Constants.String.Message.REQUIRED(Constants.String.Status.DESCRIPTION),
      ],
      maxLength: [
        1000,
        Constants.String.Message.MAX_LENGTH(
          Constants.String.Status.DESCRIPTION
        ),
      ],
    },
    color: {
      type: String,
      required: [
        true,
        Constants.String.Message.REQUIRED(Constants.String.Status.COLOR),
      ],
      minLength: [
        7,
        Constants.String.Message.MIN_LENGTH(Constants.String.Status.COLOR),
      ],
      maxLength: [
        7,
        Constants.String.Message.MAX_LENGTH(Constants.String.Status.COLOR),
      ],
      default: Constants.Styles.LIGHT_BLUE_COLOR,
    },
    deleted: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { collection: "status", timestamps: true }
);

module.exports = mongoose.model("status", statusSchema);

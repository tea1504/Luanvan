require("dotenv").config();
var mongoose = require("mongoose");
const databaseConfig = require("../../../config/database.config");
const Constants = require("../constants");

mongoose.connect(databaseConfig.v2.path);

const typeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [
        true,
        Constants.String.Message.REQUIRED(Constants.String.Type.NAME),
      ],
      maxLength: [
        100,
        Constants.String.Message.MAX_LENGTH(Constants.String.Type.NAME),
      ],
      unique: [
        true,
        Constants.String.Message.UNIQUE(Constants.String.Type.NAME),
      ],
    },
    notation: {
      type: String,
      required: [
        true,
        Constants.String.Message.REQUIRED(Constants.String.Type.NOTATION),
      ],
      maxLength: [
        10,
        Constants.String.Message.MAX_LENGTH(Constants.String.Type.NOTATION),
      ],
      unique: [
        true,
        Constants.String.Message.UNIQUE(Constants.String.Type.NOTATION),
      ],
    },
    description: {
      type: String,
      required: false,
      maxLength: [
        1000,
        Constants.String.Message.MAX_LENGTH(Constants.String.Type.DESCRIPTION),
      ],
    },
    color: {
      type: String,
      required: [
        true,
        Constants.String.Message.REQUIRED(Constants.String.Type.COLOR),
      ],
      minLength: [
        7,
        Constants.String.Message.MIN_LENGTH(Constants.String.Type.COLOR),
      ],
      maxLength: [
        7,
        Constants.String.Message.MAX_LENGTH(Constants.String.Type.COLOR),
      ],
      default: Constants.Styles.LIGHT_BLUE_COLOR,
    },
    deleted: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { collection: "types", timestamps: true }
);

module.exports = mongoose.model("types", typeSchema);

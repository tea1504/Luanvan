require("dotenv").config();
var mongoose = require("mongoose");
var databaseConfig = require("../../../config/database.config");
const Constants = require("../constants");

mongoose.connect(databaseConfig.v2.path);

const languageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [
        true,
        Constants.String.Message.REQUIRED(Constants.String.Language.NAME),
      ],
      maxLength: [
        100,
        Constants.String.Message.MAX_LENGTH(Constants.String.Language.NAME),
      ],
    },
    notation: {
      type: String,
      required: [
        true,
        Constants.String.Message.REQUIRED(Constants.String.Language.NOTATION),
      ],
      maxLength: [
        10,
        Constants.String.Message.MAX_LENGTH(Constants.String.Language.NOTATION),
      ],
    },
    description: {
      type: String,
      required: false,
      maxLength: [
        1000,
        Constants.String.Message.MAX_LENGTH(Constants.String.Language.DESCRIPTION),
      ],
    },
    color: {
      type: String,
      required: [
        true,
        Constants.String.Message.REQUIRED(Constants.String.Language.COLOR),
      ],
      minLength: [
        7,
        Constants.String.Message.MIN_LENGTH(Constants.String.Language.COLOR),
      ],
      maxLength: [
        7,
        Constants.String.Message.MAX_LENGTH(Constants.String.Language.COLOR),
      ],
      default: Constants.Styles.LIGHT_BLUE_COLOR,
    },
    deleted: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { collection: "languages", timestamps: true }
);

module.exports = mongoose.model("languages", languageSchema);

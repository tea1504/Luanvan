require("dotenv").config();
var mongoose = require("mongoose");
var databaseConfig = require("../../../config/database.config");
const Constants = require("../constants");

mongoose.connect(databaseConfig.v2.path);

const prioritySchema = new mongoose.Schema(
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
      default: Constants.Styles.LIGHT_BLUE_COLOR,
    },
    deleted: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { collection: "priorities", timestamps: true }
);

module.exports = mongoose.model("priorities", prioritySchema);

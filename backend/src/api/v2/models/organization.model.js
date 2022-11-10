require("dotenv").config();
var mongoose = require("mongoose");
var databaseConfig = require("../../../config/database.config");
const Constants = require("../constants");

mongoose.connect(databaseConfig.v2.path);

const organizationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [
        true,
        Constants.String.Message.REQUIRED(Constants.String.Organization.NAME),
      ],
      maxLength: [
        200,
        Constants.String.Message.MAX_LENGTH(Constants.String.Organization.NAME),
      ],
    },
    code: {
      type: String,
      required: [
        true,
        Constants.String.Message.REQUIRED(Constants.String.Organization.CODE),
      ],
      maxLength: [
        10,
        Constants.String.Message.MAX_LENGTH(Constants.String.Organization.CODE),
      ],
      unique: [
        true,
        Constants.String.Message.UNIQUE(Constants.String.Organization.CODE),
      ],
    },
    emailAddress: {
      type: String,
      required: [
        true,
        Constants.String.Message.REQUIRED(
          Constants.String.Organization.EMAIL_ADDRESS
        ),
      ],
      unique: [
        true,
        Constants.String.Message.UNIQUE(
          Constants.String.Organization.EMAIL_ADDRESS
        ),
      ],
      maxLength: [
        200,
        Constants.String.Message.MAX_LENGTH(
          Constants.String.Organization.EMAIL_ADDRESS
        ),
      ],
      // match: [
      //   Constants.RegExp.EMAIL_ADDRESS,
      //   Constants.String.Message.MATCH(
      //     Constants.String.Organization.EMAIL_ADDRESS
      //   ),
      // ],
    },
    phoneNumber: {
      type: String,
      required: [
        true,
        Constants.String.Message.REQUIRED(
          Constants.String.Organization.PHONE_NUMBER
        ),
      ],
      unique: [
        true,
        Constants.String.Message.UNIQUE(
          Constants.String.Organization.PHONE_NUMBER
        ),
      ],
      maxLength: [
        10,
        Constants.String.Message.MAX_LENGTH(
          Constants.String.Organization.PHONE_NUMBER
        ),
      ],
      match: [
        Constants.RegExp.PHONE_NUMBER,
        Constants.String.Message.MATCH(
          Constants.String.Organization.PHONE_NUMBER
        ),
      ],
    },
    organ: {
      type: mongoose.ObjectId,
      ref: "organizations",
    },
    inside: {
      type: Boolean,
      required: true,
      default: false,
    },
    deleted: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { collection: "organizations", timestamps: true }
);

module.exports = mongoose.model("organizations", organizationSchema);

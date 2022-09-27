require("dotenv").config();
var mongoose = require("mongoose");
var databaseConfig = require("../../../config/database.config");
const Constants = require("../constants");
const rightModel = require("./right.model");
const officerStatus = require("./officerStatus.model");
const organizationModel = require("./organization.model");

mongoose.connect(databaseConfig.v2.path);

const officerSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [
        true,
        Constants.String.Message.REQUIRED(Constants.String.Officer.CODE),
      ],
      unique: [
        true,
        Constants.String.Message.UNIQUE(Constants.String.Officer.CODE),
      ],
      maxLength: [
        10,
        Constants.String.Message.MAX_LENGTH(Constants.String.Officer.CODE),
      ],
    },
    position: {
      type: String,
      required: [
        true,
        Constants.String.Message.REQUIRED(Constants.String.Officer.CODE),
      ],
      maxLength: [
        100,
        Constants.String.Message.MAX_LENGTH(Constants.String.Officer.CODE),
      ],
    },
    firstName: {
      type: String,
      required: [
        true,
        Constants.String.Message.REQUIRED(Constants.String.Officer.CODE),
      ],
      maxLength: [
        10,
        Constants.String.Message.MAX_LENGTH(Constants.String.Officer.CODE),
      ],
    },
    lastName: {
      type: String,
      required: [
        true,
        Constants.String.Message.REQUIRED(Constants.String.Officer.CODE),
      ],
      maxLength: [
        40,
        Constants.String.Message.MAX_LENGTH(Constants.String.Officer.CODE),
      ],
    },
    emailAddress: {
      type: String,
      required: [
        true,
        Constants.String.Message.REQUIRED(
          Constants.String.Officer.EMAIL_ADDRESS
        ),
      ],
      unique: [
        true,
        Constants.String.Message.UNIQUE(Constants.String.Officer.EMAIL_ADDRESS),
      ],
      maxLength: [
        200,
        Constants.String.Message.MAX_LENGTH(
          Constants.String.Officer.EMAIL_ADDRESS
        ),
      ],
      match: [
        Constants.RegExp.EMAIL_ADDRESS,
        Constants.String.Message.MATCH(Constants.String.Officer.EMAIL_ADDRESS),
      ],
    },
    phoneNumber: {
      type: String,
      required: [
        true,
        Constants.String.Message.REQUIRED(
          Constants.String.Officer.PHONE_NUMBER
        ),
      ],
      unique: [
        true,
        Constants.String.Message.UNIQUE(Constants.String.Officer.PHONE_NUMBER),
      ],
      maxLength: [
        10,
        Constants.String.Message.MAX_LENGTH(
          Constants.String.Officer.PHONE_NUMBER
        ),
      ],
      match: [
        Constants.RegExp.PHONE_NUMBER,
        Constants.String.Message.MATCH(Constants.String.Officer.PHONE_NUMBER),
      ],
    },
    password: [
      {
        value: {
          type: String,
          required: [
            true,
            Constants.String.Message.REQUIRED(
              Constants.String.Officer.PASSWORD.VALUE
            ),
          ],
          maxLength: [
            255,
            Constants.String.Message.MAX_LENGTH(
              Constants.String.Officer.PASSWORD.VALUE
            ),
          ],
        },
        time: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    organ: {
      type: mongoose.ObjectId,
      ref: organizationModel,
      required: [
        true,
        Constants.String.Message.REQUIRED(Constants.String.Officer.ORGAN),
      ],
    },
    file: {
      name: {
        type: String,
        required: [
          true,
          Constants.String.Message.REQUIRED(Constants.String.Officer.FILE.NAME),
        ],
        maxLength: [
          200,
          Constants.String.Message.MAX_LENGTH(
            Constants.String.Officer.FILE.NAME
          ),
        ],
      },
      path: {
        type: String,
        required: [
          true,
          Constants.String.Message.REQUIRED(Constants.String.Officer.FILE.PATH),
        ],
        maxLength: [
          200,
          Constants.String.Message.MAX_LENGTH(
            Constants.String.Officer.FILE.PATH
          ),
        ],
      },
      typeFile: {
        type: String,
        required: false,
        maxLength: [
          10,
          Constants.String.Message.MAX_LENGTH(
            Constants.String.Officer.FILE.TYPE
          ),
        ],
      },
      size: {
        type: Number,
        required: false,
      },
      required: false,
    },
    status: {
      type: mongoose.ObjectId,
      ref: officerStatus,
      required: [
        true,
        Constants.String.Message.REQUIRED(Constants.String.Officer.STATUS),
      ],
    },
    right: {
      type: mongoose.ObjectId,
      ref: rightModel,
      required: [
        true,
        Constants.String.Message.REQUIRED(Constants.String.Officer.RIGHT),
      ],
    },
    deleted: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { collection: "officers", timestamps: true }
);

module.exports = mongoose.model("officers", officerSchema);

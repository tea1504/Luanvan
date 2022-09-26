require("dotenv").config();
var mongoose = require("mongoose");
var databaseConfig = require("../../../config/database.config");
const Constants = require("../constants");

mongoose.connect(databaseConfig.v2.path);

const statusSchema = new mongoose.Schema(
  {
    code: {
      type: Number,
      required: [
        true,
        Constants.String.Message.REQUIRED(Constants.String.ODT.CODE),
      ],
      maxLength: [
        11,
        Constants.String.Message.MAX_LENGTH(Constants.String.ODT.CODE),
      ],
    },
    issuedDate: {
      type: Date,
      required: [
        true,
        Constants.String.Message.REQUIRED(Constants.String.ODT.ISSUED_DATE),
      ],
    },
    subject: {
      type: String,
      required: [
        true,
        Constants.String.Message.REQUIRED(Constants.String.ODT.SUBJECT),
      ],
      maxLength: [
        500,
        Constants.String.Message.MAX_LENGTH(Constants.String.ODT.SUBJECT),
      ],
    },
    type: {
      type: mongoose.ObjectId,
      ref: "types",
      required: [
        true,
        Constants.String.Message.REQUIRED(Constants.String.ODT.TYPE),
      ],
    },
    language: {
      type: mongoose.ObjectId,
      ref: "language",
      required: [
        true,
        Constants.String.Message.REQUIRED(Constants.String.ODT.LANGUAGE),
      ],
    },
    pageAmount: {
      type: Number,
      required: [
        true,
        Constants.String.Message.REQUIRED(Constants.String.ODT.PAGE_AMOUNT),
      ],
    },
    description: {
      type: String,
      required: false,
      maxLength: [
        500,
        Constants.String.Message.MAX_LENGTH(Constants.String.ODT.DESCRIPTION),
      ],
    },
    signerInfoName: {
      type: String,
      required: [
        true,
        Constants.String.Message.REQUIRED(
          Constants.String.ODT.SIGNER_INFO_NAME
        ),
      ],
      maxLength: [
        500,
        Constants.String.Message.MAX_LENGTH(
          Constants.String.ODT.SIGNER_INFO_NAME
        ),
      ],
    },
    signerInfoPosition: {
      type: String,
      required: [
        true,
        Constants.String.Message.REQUIRED(
          Constants.String.ODT.SIGNER_INFO_POSITION
        ),
      ],
      maxLength: [
        500,
        Constants.String.Message.MAX_LENGTH(
          Constants.String.ODT.SIGNER_INFO_POSITION
        ),
      ],
    },
    dueDate: {
      type: Date,
      required: [
        true,
        Constants.String.Message.REQUIRED(Constants.String.ODT.DUE_DATE),
      ],
    },
    issuedAmount: {
      type: Number,
      required: [
        true,
        Constants.String.Message.REQUIRED(Constants.String.ODT.ARRIVAL_NUMBER),
      ],
    },
    priority: {
      type: mongoose.ObjectId,
      ref: "priorities",
      required: [
        true,
        Constants.String.Message.REQUIRED(Constants.String.ODT.PRIORITY),
      ],
    },
    security: {
      type: mongoose.ObjectId,
      ref: "securities",
      required: [
        true,
        Constants.String.Message.REQUIRED(Constants.String.ODT.SECURITY),
      ],
    },
    organ: {
      type: mongoose.ObjectId,
      ref: "organizations",
      required: [
        true,
        Constants.String.Message.REQUIRED(Constants.String.ODT.ORGAN),
      ],
    },
    importer: {
      type: mongoose.ObjectId,
      ref: "officers",
      required: [
        true,
        Constants.String.Message.REQUIRED(Constants.String.ODT.IMPORTER),
      ],
    },
    file: [
      {
        name: {
          type: String,
          required: [
            true,
            Constants.String.Message.REQUIRED(Constants.String.ODT.FILE.NAME),
          ],
          maxLength: [
            200,
            Constants.String.Message.MAX_LENGTH(Constants.String.ODT.FILE.NAME),
          ],
        },
        path: {
          type: String,
          required: [
            true,
            Constants.String.Message.REQUIRED(Constants.String.ODT.FILE.PATH),
          ],
          maxLength: [
            200,
            Constants.String.Message.MAX_LENGTH(Constants.String.ODT.FILE.PATH),
          ],
        },
        typeFile: {
          type: String,
          required: false,
          maxLength: [
            10,
            Constants.String.Message.MAX_LENGTH(Constants.String.ODT.FILE.TYPE),
          ],
        },
        size: {
          type: Number,
          required: false,
        },
        required: false,
      },
    ],
    deleted: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { collection: "officialDispatchTravel", timestamps: true }
);

module.exports = mongoose.model("status", statusSchema);

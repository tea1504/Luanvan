require("dotenv").config();
var mongoose = require("mongoose");
var databaseConfig = require("../../../config/database.config");
const Constants = require("../constants");
const languageModel = require("./language.model");
const officerModel = require("./officer.model");
const organizationModel = require("./organization.model");
const priorityModel = require("./priority.model");
const securityModel = require("./security.model");
const statusModel = require("./status.model");
const typeModel = require("./type.model");

mongoose.connect(databaseConfig.v2.path);

const officialDispatchTravelSchema = new mongoose.Schema(
  {
    code: {
      type: Number,
      maxLength: [
        11,
        Constants.String.Message.MAX_LENGTH(Constants.String.ODT.CODE),
      ],
    },
    issuedDate: {
      type: Date,
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
      ref: typeModel,
      required: [
        true,
        Constants.String.Message.REQUIRED(Constants.String.ODT.TYPE),
      ],
    },
    language: {
      type: mongoose.ObjectId,
      ref: languageModel,
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
        50,
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
      ref: priorityModel,
      required: [
        true,
        Constants.String.Message.REQUIRED(Constants.String.ODT.PRIORITY),
      ],
    },
    security: {
      type: mongoose.ObjectId,
      ref: securityModel,
      required: [
        true,
        Constants.String.Message.REQUIRED(Constants.String.ODT.SECURITY),
      ],
    },
    organ: [
      {
        type: mongoose.ObjectId,
        ref: organizationModel,
        required: [
          true,
          Constants.String.Message.REQUIRED(Constants.String.ODT.ORGAN),
        ],
      },
    ],
    approver: {
      type: mongoose.ObjectId,
      ref: officerModel,
      required: false,
    },
    importer: {
      type: mongoose.ObjectId,
      ref: officerModel,
      required: [
        true,
        Constants.String.Message.REQUIRED(Constants.String.ODT.IMPORTER),
      ],
    },
    status: {
      type: mongoose.ObjectId,
      ref: statusModel,
      required: [
        true,
        Constants.String.Message.REQUIRED(
          Constants.String.IOD.TRACE_HEADER_LIST.STATUS
        ),
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
  { collection: "officialDispatchTravels", timestamps: true }
);

module.exports = mongoose.model(
  "officialDispatchTravels",
  officialDispatchTravelSchema
);

require("dotenv").config();
var mongoose = require("mongoose");
var databaseConfig = require("../../../config/database.config");
const Constants = require("../constants");
const languageModel = require("./language.model");
const officerModel = require("./officer.model");
const organizationModel = require("./organization.model");
const priorityModel = require("./priority.model");
const securityModel = require("./security.model");
const typeModel = require("./type.model");
const statusModel = require("./status.model");

mongoose.connect(databaseConfig.v2.path);

const incomingOfficialDispatchSchema = new mongoose.Schema(
  {
    code: {
      type: Number,
      required: [
        true,
        Constants.String.Message.REQUIRED(Constants.String.IOD.CODE),
      ],
      maxLength: [
        11,
        Constants.String.Message.MAX_LENGTH(Constants.String.IOD.CODE),
      ],
    },
    issuedDate: {
      type: Date,
      required: [
        true,
        Constants.String.Message.REQUIRED(Constants.String.IOD.ISSUED_DATE),
      ],
    },
    subject: {
      type: String,
      required: [
        true,
        Constants.String.Message.REQUIRED(Constants.String.IOD.SUBJECT),
      ],
      maxLength: [
        500,
        Constants.String.Message.MAX_LENGTH(Constants.String.IOD.SUBJECT),
      ],
    },
    type: {
      type: mongoose.ObjectId,
      ref: typeModel,
      required: [
        true,
        Constants.String.Message.REQUIRED(Constants.String.IOD.TYPE),
      ],
    },
    language: {
      type: mongoose.ObjectId,
      ref: languageModel,
      required: [
        true,
        Constants.String.Message.REQUIRED(Constants.String.IOD.LANGUAGE),
      ],
    },
    pageAmount: {
      type: Number,
      required: [
        true,
        Constants.String.Message.REQUIRED(Constants.String.IOD.PAGE_AMOUNT),
      ],
    },
    description: {
      type: String,
      required: false,
      maxLength: [
        500,
        Constants.String.Message.MAX_LENGTH(Constants.String.IOD.DESCRIPTION),
      ],
    },
    signerInfoName: {
      type: String,
      required: [
        true,
        Constants.String.Message.REQUIRED(
          Constants.String.IOD.SIGNER_INFO_NAME
        ),
      ],
      maxLength: [
        500,
        Constants.String.Message.MAX_LENGTH(
          Constants.String.IOD.SIGNER_INFO_NAME
        ),
      ],
    },
    signerInfoPosition: {
      type: String,
      required: [
        true,
        Constants.String.Message.REQUIRED(
          Constants.String.IOD.SIGNER_INFO_POSITION
        ),
      ],
      maxLength: [
        500,
        Constants.String.Message.MAX_LENGTH(
          Constants.String.IOD.SIGNER_INFO_POSITION
        ),
      ],
    },
    dueDate: {
      type: Date,
      required: [
        true,
        Constants.String.Message.REQUIRED(Constants.String.IOD.DUE_DATE),
      ],
    },
    arrivalNumber: {
      type: Number,
    },
    arrivalDate: {
      type: Date,
      required: [
        true,
        Constants.String.Message.REQUIRED(Constants.String.IOD.ARRIVAL_DATE),
      ],
    },
    priority: {
      type: mongoose.ObjectId,
      ref: priorityModel,
      required: [
        true,
        Constants.String.Message.REQUIRED(Constants.String.IOD.PRIORITY),
      ],
    },
    security: {
      type: mongoose.ObjectId,
      ref: securityModel,
      required: [
        true,
        Constants.String.Message.REQUIRED(Constants.String.IOD.SECURITY),
      ],
    },
    organ: {
      type: mongoose.ObjectId,
      ref: organizationModel,
      required: [
        true,
        Constants.String.Message.REQUIRED(Constants.String.IOD.ORGAN),
      ],
    },
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
        Constants.String.Message.REQUIRED(Constants.String.IOD.IMPORTER),
      ],
    },
    handler: [{ type: mongoose.ObjectId, ref: officerModel, required: false }],
    traceHeaderList: [
      {
        officer: {
          type: mongoose.ObjectId,
          ref: officerModel,
          required: [
            true,
            Constants.String.Message.REQUIRED(
              Constants.String.IOD.TRACE_HEADER_LIST.OFFICER
            ),
          ],
        },
        command: {
          type: String,
          required: [
            true,
            Constants.String.Message.REQUIRED(
              Constants.String.IOD.TRACE_HEADER_LIST.COMMAND
            ),
          ],
          maxLength: [
            1000,
            Constants.String.Message.MAX_LENGTH(
              Constants.String.IOD.TRACE_HEADER_LIST.COMMAND
            ),
          ],
        },
        date: {
          type: Date,
          required: [
            true,
            Constants.String.Message.REQUIRED(
              Constants.String.IOD.TRACE_HEADER_LIST.DATE
            ),
          ],
          default: Date.now,
        },
        header: {
          type: String,
          required: [
            true,
            Constants.String.Message.REQUIRED(
              Constants.String.IOD.TRACE_HEADER_LIST.HEADER
            ),
          ],
          maxLength: [
            200,
            Constants.String.Message.MAX_LENGTH(
              Constants.String.IOD.TRACE_HEADER_LIST.HEADER
            ),
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
      },
    ],
    file: [
      {
        name: {
          type: String,
          required: [
            true,
            Constants.String.Message.REQUIRED(Constants.String.IOD.FILE.NAME),
          ],
          maxLength: [
            200,
            Constants.String.Message.MAX_LENGTH(Constants.String.IOD.FILE.NAME),
          ],
        },
        path: {
          type: String,
          required: [
            true,
            Constants.String.Message.REQUIRED(Constants.String.IOD.FILE.PATH),
          ],
          maxLength: [
            200,
            Constants.String.Message.MAX_LENGTH(Constants.String.IOD.FILE.PATH),
          ],
        },
        typeFile: {
          type: String,
          required: false,
          maxLength: [
            100,
            Constants.String.Message.MAX_LENGTH(Constants.String.IOD.FILE.TYPE),
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
  { collection: "incomingOfficialDispatches", timestamps: true }
);

module.exports = mongoose.model(
  "incomingOfficialDispatches",
  incomingOfficialDispatchSchema
);

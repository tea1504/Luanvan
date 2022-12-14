require("dotenv").config();
var mongoose = require("mongoose");
var databaseConfig = require("../../../config/database.config");
const Constants = require("../constants");

mongoose.connect(databaseConfig.v2.path);

const rightSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [
        true,
        Constants.String.Message.REQUIRED(Constants.String.Right.NAME),
      ],
      maxLength: [
        100,
        Constants.String.Message.MAX_LENGTH(Constants.String.Right.NAME),
      ],
    },
    readOD: {
      type: Boolean,
      required: [
        true,
        Constants.String.Message.REQUIRED(
          Constants.String.Right.READ_OFFICIAL_DISPATCH
        ),
      ],
      default: false,
    },
    createOD: {
      type: Boolean,
      required: [
        true,
        Constants.String.Message.REQUIRED(
          Constants.String.Right.CREATE_OFFICIAL_DISPATCH
        ),
      ],
      default: false,
    },
    updateOD: {
      type: Boolean,
      required: [
        true,
        Constants.String.Message.REQUIRED(
          Constants.String.Right.UPDATE_OFFICIAL_DISPATCH
        ),
      ],
      default: false,
    },
    deleteOD: {
      type: Boolean,
      required: [
        true,
        Constants.String.Message.REQUIRED(
          Constants.String.Right.DELETE_OFFICIAL_DISPATCH
        ),
      ],
      default: false,
    },
    approveOD: {
      type: Boolean,
      required: [
        true,
        Constants.String.Message.REQUIRED(
          Constants.String.Right.APPROVE_OFFICIAL_DISPATCH
        ),
      ],
      default: false,
    },
    readOfficer: {
      type: Boolean,
      required: [
        true,
        Constants.String.Message.REQUIRED(Constants.String.Right.READ_OFFICER),
      ],
      default: false,
    },
    createOfficer: {
      type: Boolean,
      required: [
        true,
        Constants.String.Message.REQUIRED(
          Constants.String.Right.CREATE_OFFICER
        ),
      ],
      default: false,
    },
    updateOfficer: {
      type: Boolean,
      required: [
        true,
        Constants.String.Message.REQUIRED(
          Constants.String.Right.UPDATE_OFFICER
        ),
      ],
      default: false,
    },
    deleteOfficer: {
      type: Boolean,
      required: [
        true,
        Constants.String.Message.REQUIRED(
          Constants.String.Right.DELETE_OFFICER
        ),
      ],
      default: false,
    },
    readCategories: {
      type: Boolean,
      required: [
        true,
        Constants.String.Message.REQUIRED(
          Constants.String.Right.READ_CATEGORIES
        ),
      ],
      default: false,
    },
    createCategories: {
      type: Boolean,
      required: [
        true,
        Constants.String.Message.REQUIRED(
          Constants.String.Right.CREATE_CATEGORIES
        ),
      ],
      default: false,
    },
    updateCategories: {
      type: Boolean,
      required: [
        true,
        Constants.String.Message.REQUIRED(
          Constants.String.Right.UPDATE_CATEGORIES
        ),
      ],
      default: false,
    },
    deleteCategories: {
      type: Boolean,
      required: [
        true,
        Constants.String.Message.REQUIRED(
          Constants.String.Right.DELETE_CATEGORIES
        ),
      ],
      default: false,
    },
    createRight: {
      type: Boolean,
      required: [
        true,
        Constants.String.Message.REQUIRED(Constants.String.Right.CREATE_RIGHT),
      ],
      default: false,
    },
    readRight: {
      type: Boolean,
      required: [
        true,
        Constants.String.Message.REQUIRED(Constants.String.Right.READ_RIGHT),
      ],
      default: false,
    },
    updateRight: {
      type: Boolean,
      required: [
        true,
        Constants.String.Message.REQUIRED(Constants.String.Right.UPDATE_RIGHT),
      ],
      default: false,
    },
    deleteRight: {
      type: Boolean,
      required: [
        true,
        Constants.String.Message.REQUIRED(Constants.String.Right.DELETE_RIGHT),
      ],
      default: false,
    },
    scope: {
      type: Number,
      required: [
        true,
        Constants.String.Message.REQUIRED(Constants.String.Right.SCOPE),
      ],
      default: 0,
    },
    deleted: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { collection: "rights", timestamps: true }
);

module.exports = mongoose.model("rights", rightSchema);

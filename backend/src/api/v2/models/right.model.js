require("dotenv").config();
var mongoose = require("mongoose");
var databaseConfig = require("../../../config/database.config");

mongoose.connect(databaseConfig.v2.path);

const rightSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxLength: 20,
    },
    createOD: {
      type: Boolean,
      required: true,
      default: false,
    },
    updateOD: {
      type: Boolean,
      required: true,
      default: false,
    },
    deleteOD: {
      type: Boolean,
      required: true,
      default: false,
    },
    approveOD: {
      type: Boolean,
      required: true,
      default: false,
    },
    createOfficer: {
      type: Boolean,
      required: true,
      default: false,
    },
    updateOfficer: {
      type: Boolean,
      required: true,
      default: false,
    },
    deleteOfficer: {
      type: Boolean,
      required: true,
      default: false,
    },
    createCategories: {
      type: Boolean,
      required: true,
      default: false,
    },
    updateCategories: {
      type: Boolean,
      required: true,
      default: false,
    },
    deleteCategories: {
      type: Boolean,
      required: true,
      default: false,
    },
    scope: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { collection: "rights", timestamps: true }
);

module.exports = mongoose.model("rights", rightSchema);

require("dotenv").config();
const Constants = require("../constants");
const officerStatusModel = require("../models/officerStatus.model");
const { parse } = require("csv-parse/sync");

var officerStatusService = {
  /**
   * @param {number} size
   * @param {number} page
   * @param {string} filter
   * @returns {import("../interfaces").ResponseResult}
   */
  getOfficerStatuses: async (limit = 10, pageNumber = 1, filter = "") => {
    try {
      const result = {};
      const totalOfficerStatus = await officerStatusModel.countDocuments({
        deleted: false,
      });
      let startIndex = (pageNumber - 1) * limit;
      let endIndex = pageNumber * limit;
      result.total = totalOfficerStatus;
      if (startIndex > 0) {
        result.previous = {
          pageNumber: pageNumber - 1,
          limit: limit,
        };
      }
      if (endIndex < totalOfficerStatus) {
        result.next = {
          pageNumber: pageNumber + 1,
          limit: limit,
        };
      }
      result.rowsPerPage = limit;
      result.data = await officerStatusModel
        .find({
          deleted: false,
          $or: [
            { name: { $regex: filter } },
            { description: { $regex: filter } },
          ],
        })
        .skip(startIndex)
        .limit(limit)
        .sort({ createdAt: -1 });
      return {
        status: Constants.ApiCode.SUCCESS,
        message: Constants.String.Message.GET_200(
          Constants.String.OfficerStatus._
        ),
        data: result,
      };
    } catch (error) {
      return {
        status: Constants.ApiCode.INTERNAL_SERVER_ERROR,
        message: Constants.String.Message.ERR_500,
        data: { error: error.message },
      };
    }
  },
  /**
   * @param {string} id
   * @returns {import("../interfaces").ResponseResult}
   */
  getOfficerStatus: async (id) => {
    try {
      const type = await officerStatusModel.findOne({
        _id: id,
        deleted: false,
      });
      if (!type)
        return {
          status: Constants.ApiCode.NOT_FOUND,
          message: Constants.String.Message.ERR_404(
            Constants.String.OfficerStatus._
          ),
        };
      return {
        status: Constants.ApiCode.SUCCESS,
        message: Constants.String.Message.GET_200(
          Constants.String.OfficerStatus._
        ),
        data: type,
      };
    } catch (error) {
      switch (error.name) {
        case "CastError":
          return {
            status: Constants.ApiCode.NOT_ACCEPTABLE,
            message: Constants.String.Message.ERR_406,
            data: { error: error.message },
          };
        default:
          return {
            status: Constants.ApiCode.INTERNAL_SERVER_ERROR,
            message: Constants.String.Message.ERR_500,
            data: { error: error.message },
          };
      }
    }
  },
  /**
   * @param {import("../interfaces").OfficerStatusModel} officerStatus
   * @returns {import("../interfaces").ResponseResult}
   */
  post: async (officerStatus) => {
    try {
      const officerStatusName = await officerStatusModel.findOne({
        name: officerStatus.name,
        deleted: false,
      });
      if (officerStatusName)
        return {
          status: Constants.ApiCode.NOT_ACCEPTABLE,
          message: Constants.String.Message.UNIQUE(
            Constants.String.OfficerStatus.NAME
          ),
        };
      const newOfficerStatus = await officerStatusModel.create(officerStatus);
      return {
        status: Constants.ApiCode.SUCCESS,
        message: Constants.String.Message.POST_200(
          Constants.String.OfficerStatus._
        ),
        data: newOfficerStatus,
      };
    } catch (error) {
      switch (error.name) {
        case "ValidationError":
          return {
            status: Constants.ApiCode.NOT_ACCEPTABLE,
            message: Constants.String.Message.ERR_406,
            data: { error: error.errors },
          };
        case "MongoServerError":
          return {
            status: Constants.ApiCode.NOT_ACCEPTABLE,
            message: Constants.String.Message.ERR_406,
            data: { error: error.message },
          };
        default:
          return {
            status: Constants.ApiCode.INTERNAL_SERVER_ERROR,
            message: Constants.String.Message.ERR_500,
            data: { error: error.message },
          };
      }
    }
  },
  postOfficerStatuses: async (str) => {
    const list = [];
    try {
      const records = parse(str, { delimiter: "," });
      for (var i = records.length - 1; i >= 0; i--) {
        if ((records[i][0] + "").trim() === "")
          return {
            status: Constants.ApiCode.NOT_ACCEPTABLE,
            message: Constants.String.Message.ERR_406,
            data: list,
          };
        var item = { name: (records[i][0] + "").trim() };
        if (records[i][1]) item.description = (records[i][1] + "").trim();
        if (records[i][2]) item.color = (records[i][2] + "").trim();
        const itemName = await officerStatusModel.findOne({
          name: item.name,
          deleted: false,
        });
        if (itemName)
          return {
            status: Constants.ApiCode.NOT_ACCEPTABLE,
            message: Constants.String.Message.UNIQUE(
              Constants.String.Type.NAME
            ),
            data: list,
          };
        const newItem = await officerStatusModel.create(item);
        list.push(newItem);
      }
      return {
        status: Constants.ApiCode.SUCCESS,
        message: Constants.String.Message.POST_200(Constants.String.Type._),
        data: list,
      };
    } catch (error) {
      switch (error.name) {
        case "ValidationError":
          return {
            status: Constants.ApiCode.NOT_ACCEPTABLE,
            message: Constants.String.Message.ERR_406,
            data: { list, error: error.errors },
          };
        case "MongoServerError":
          return {
            status: Constants.ApiCode.NOT_ACCEPTABLE,
            message: Constants.String.Message.ERR_406,
            data: { list, error: error.message },
          };
        default:
          return {
            status: Constants.ApiCode.INTERNAL_SERVER_ERROR,
            message: Constants.String.Message.ERR_500,
            data: { error: error.message },
          };
      }
    }
  },
  /**
   * @param {string} id
   * @param {import("../interfaces").OfficerStatusModel} officerStatus
   * @returns {import("../interfaces").ResponseResult}
   */
  putOfficerStatus: async (id, officerStatus) => {
    try {
      const findOfficerStatus = await officerStatusModel.findOne({
        _id: id,
        deleted: false,
      });
      if (!findOfficerStatus)
        return {
          status: Constants.ApiCode.NOT_FOUND,
          message: Constants.String.Message.ERR_404(
            Constants.String.OfficerStatus._
          ),
        };
      const officerStatusName = await officerStatusModel.findOne({
        _id: { $ne: id },
        name: officerStatus.name,
        deleted: false,
      });
      if (officerStatusName)
        return {
          status: Constants.ApiCode.NOT_ACCEPTABLE,
          message: Constants.String.Message.UNIQUE(
            Constants.String.OfficerStatus.NAME
          ),
        };
      await officerStatusModel.findOneAndUpdate(
        { _id: id, deleted: false },
        officerStatus
      );
      const result = await officerStatusModel.findOne({ _id: id });
      return {
        status: Constants.ApiCode.SUCCESS,
        message: Constants.String.Message.PUT_200(
          Constants.String.OfficerStatus._
        ),
        data: result,
      };
    } catch (error) {
      switch (error.name) {
        case "ValidationError":
          return {
            status: Constants.ApiCode.NOT_ACCEPTABLE,
            message: Constants.String.Message.ERR_406,
            data: { error: error.errors },
          };
        case "CastError":
        case "MongoServerError":
          return {
            status: Constants.ApiCode.NOT_ACCEPTABLE,
            message: Constants.String.Message.ERR_406,
            data: { error: error.message },
          };
        default:
          return {
            status: Constants.ApiCode.INTERNAL_SERVER_ERROR,
            message: Constants.String.Message.ERR_500,
            data: { error: error.message },
          };
      }
    }
  },
  /**
   * @param {string} id
   * @returns {import("../interfaces").ResponseResult}
   */
  deleteOfficerStatus: async (id) => {
    try {
      const deletedOfficerStatus = await officerStatusModel.findOneAndUpdate(
        { _id: id, deleted: false },
        { deleted: true }
      );
      if (!deletedOfficerStatus)
        return {
          status: Constants.ApiCode.NOT_FOUND,
          message: Constants.String.Message.ERR_404(
            Constants.String.OfficerStatus._
          ),
        };
      return {
        status: Constants.ApiCode.SUCCESS,
        message: Constants.String.Message.DELETE_200(
          Constants.String.OfficerStatus._
        ),
        data: deletedOfficerStatus,
      };
    } catch (error) {
      switch (error.name) {
        case "CastError":
          return {
            status: Constants.ApiCode.NOT_ACCEPTABLE,
            message: Constants.String.Message.ERR_406,
            data: { error: error.message },
          };
        default:
          return {
            status: Constants.ApiCode.INTERNAL_SERVER_ERROR,
            message: Constants.String.Message.ERR_500,
            data: { error: error.message },
          };
      }
    }
  },
  /**
   * @param {string[]} ids
   * @returns {import("../interfaces").ResponseResult}
   */
  deleteOfficerStatuses: async (ids) => {
    try {
      const deletedOfficerStatuses = await officerStatusModel.updateMany(
        { _id: { $in: ids }, deleted: false },
        { deleted: true }
      );
      if (deletedOfficerStatuses.modifiedCount === 0)
        return {
          status: Constants.ApiCode.NOT_FOUND,
          message: Constants.String.Message.ERR_404(
            Constants.String.OfficerStatus._
          ),
        };
      return {
        status: Constants.ApiCode.SUCCESS,
        message: Constants.String.Message.DELETE_200(
          Constants.String.OfficerStatus._
        ),
        data: deletedOfficerStatuses,
      };
    } catch (error) {
      switch (error.name) {
        case "CastError":
          return {
            status: Constants.ApiCode.NOT_ACCEPTABLE,
            message: Constants.String.Message.ERR_406,
            data: { error: error.message },
          };
        default:
          return {
            status: Constants.ApiCode.INTERNAL_SERVER_ERROR,
            message: Constants.String.Message.ERR_500,
            data: { error: error.message },
          };
      }
    }
  },
};

module.exports = officerStatusService;

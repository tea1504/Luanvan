require("dotenv").config();
const Constants = require("../constants");
const securityModel = require("../models/security.model");
const { parse } = require("csv-parse/sync");
const showError = require("./error.service");

var securityService = {
  getList: async (userID = "") => {
    try {
      const result = await securityModel.find({ deleted: false }, "name");
      return {
        status: Constants.ApiCode.SUCCESS,
        message: Constants.String.Message.GET_200(Constants.String.Security._),
        data: result,
      };
    } catch (error) {
      return showError(error);
    }
  },
  /**
   * @param {number} size
   * @param {number} page
   * @param {string} filter
   * @returns {import("../interfaces").ResponseResult}
   */
  getSecurities: async (limit = 10, pageNumber = 1, filter = "") => {
    try {
      const result = {};
      const totalSecurity = await securityModel.countDocuments({
        deleted: false,
      });
      let startIndex = (pageNumber - 1) * limit;
      let endIndex = pageNumber * limit;
      result.total = totalSecurity;
      if (startIndex > 0) {
        result.previous = {
          pageNumber: pageNumber - 1,
          limit: limit,
        };
      }
      if (endIndex < totalSecurity) {
        result.next = {
          pageNumber: pageNumber + 1,
          limit: limit,
        };
      }
      result.rowsPerPage = limit;
      result.data = await securityModel
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
        message: Constants.String.Message.GET_200(Constants.String.Security._),
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
  getSecurity: async (id) => {
    try {
      const security = await securityModel.findOne({ _id: id, deleted: false });
      if (!security)
        return {
          status: Constants.ApiCode.NOT_FOUND,
          message: Constants.String.Message.ERR_404(
            Constants.String.Security._
          ),
        };
      return {
        status: Constants.ApiCode.SUCCESS,
        message: Constants.String.Message.GET_200(Constants.String.Security._),
        data: security,
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
   * @param {import("../interfaces").SecurityModel} security
   * @returns {import("../interfaces").ResponseResult}
   */
  post: async (security) => {
    try {
      const securityName = await securityModel.findOne({
        name: security.name,
        deleted: false,
      });
      if (securityName)
        return {
          status: Constants.ApiCode.NOT_ACCEPTABLE,
          message: Constants.String.Message.UNIQUE(
            Constants.String.Security.NAME
          ),
        };
      const newSecurity = await securityModel.create(security);
      return {
        status: Constants.ApiCode.SUCCESS,
        message: Constants.String.Message.POST_200(Constants.String.Security._),
        data: newSecurity,
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
  postSecurities: async (str) => {
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
        const securityName = await securityModel.findOne({
          name: item.name,
          deleted: false,
        });
        if (securityName)
          return {
            status: Constants.ApiCode.NOT_ACCEPTABLE,
            message: Constants.String.Message.UNIQUE(
              Constants.String.Type.NAME
            ),
            data: list,
          };
        const newSecurity = await securityModel.create(item);
        list.push(newSecurity);
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
   * @param {import("../interfaces").SecurityModel} security
   * @returns {import("../interfaces").ResponseResult}
   */
  putSecurity: async (id, security) => {
    try {
      const findSecurity = await securityModel.findOne({
        _id: id,
        deleted: false,
      });
      if (!findSecurity)
        return {
          status: Constants.ApiCode.NOT_FOUND,
          message: Constants.String.Message.ERR_404(
            Constants.String.Security._
          ),
        };
      const securityName = await securityModel.findOne({
        _id: { $ne: id },
        name: security.name,
        deleted: false,
      });
      if (securityName)
        return {
          status: Constants.ApiCode.NOT_ACCEPTABLE,
          message: Constants.String.Message.UNIQUE(
            Constants.String.Security.NAME
          ),
        };
      await securityModel.findOneAndUpdate(
        { _id: id, deleted: false },
        security
      );
      const result = await securityModel.findOne({ _id: id });
      return {
        status: Constants.ApiCode.SUCCESS,
        message: Constants.String.Message.PUT_200(Constants.String.Security._),
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
  deleteSecurity: async (id) => {
    try {
      const deletedSecurity = await securityModel.findOneAndUpdate(
        { _id: id, deleted: false },
        { deleted: true }
      );
      if (!deletedSecurity)
        return {
          status: Constants.ApiCode.NOT_FOUND,
          message: Constants.String.Message.ERR_404(
            Constants.String.Security._
          ),
        };
      return {
        status: Constants.ApiCode.SUCCESS,
        message: Constants.String.Message.DELETE_200(
          Constants.String.Security._
        ),
        data: deletedSecurity,
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
  deleteSecurities: async (ids) => {
    try {
      const deletedSecurities = await securityModel.updateMany(
        { _id: { $in: ids }, deleted: false },
        { deleted: true }
      );
      if (deletedSecurities.modifiedCount === 0)
        return {
          status: Constants.ApiCode.NOT_FOUND,
          message: Constants.String.Message.ERR_404(
            Constants.String.Security._
          ),
        };
      return {
        status: Constants.ApiCode.SUCCESS,
        message: Constants.String.Message.DELETE_200(
          Constants.String.Security._
        ),
        data: deletedSecurities,
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

module.exports = securityService;

require("dotenv").config();
const Constants = require("../constants");
const priorityModel = require("../models/priority.model");

var priorityService = {
  /**
   * @param {number} size
   * @param {number} page
   * @param {string} filter
   * @returns {import("../interfaces").ResponseResult}
   */
  getPriorities: async (limit = 10, pageNumber = 1, filter = "") => {
    try {
      const result = {};
      const totalPriority = await priorityModel.countDocuments({
        deleted: false,
      });
      let startIndex = (pageNumber - 1) * limit;
      let endIndex = pageNumber * limit;
      result.total = totalPriority;
      if (startIndex > 0) {
        result.previous = {
          pageNumber: pageNumber - 1,
          limit: limit,
        };
      }
      if (endIndex < totalPriority) {
        result.next = {
          pageNumber: pageNumber + 1,
          limit: limit,
        };
      }
      result.rowsPerPage = limit;
      result.data = await priorityModel
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
        message: Constants.String.Message.GET_200(Constants.String.Priority._),
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
  getPriority: async (id) => {
    try {
      const type = await priorityModel.findOne({ _id: id, deleted: false });
      if (!type)
        return {
          status: Constants.ApiCode.NOT_FOUND,
          message: Constants.String.Message.ERR_404(
            Constants.String.Priority._
          ),
        };
      return {
        status: Constants.ApiCode.SUCCESS,
        message: Constants.String.Message.GET_200(Constants.String.Priority._),
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
   * @param {import("../interfaces").PriorityModel} priority
   * @returns {import("../interfaces").ResponseResult}
   */
  post: async (priority) => {
    try {
      const priorityName = await priorityModel.findOne({
        name: priority.name,
        deleted: false,
      });
      if (priorityName)
        return {
          status: Constants.ApiCode.NOT_ACCEPTABLE,
          message: Constants.String.Message.UNIQUE(
            Constants.String.Priority.NAME
          ),
        };
      const newPriority = await priorityModel.create(priority);
      return {
        status: Constants.ApiCode.SUCCESS,
        message: Constants.String.Message.POST_200(Constants.String.Priority._),
        data: newPriority,
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
  /**
   * @param {string} id
   * @param {import("../interfaces").PriorityModel} priority
   * @returns {import("../interfaces").ResponseResult}
   */
  putPriority: async (id, priority) => {
    try {
      const findPriority = await priorityModel.findOne({
        _id: id,
        deleted: false,
      });
      if (!findPriority)
        return {
          status: Constants.ApiCode.NOT_FOUND,
          message: Constants.String.Message.ERR_404(
            Constants.String.Priority._
          ),
        };
      const priorityName = await priorityModel.findOne({
        _id: { $ne: id },
        name: priority.name,
        deleted: false,
      });
      if (priorityName)
        return {
          status: Constants.ApiCode.NOT_ACCEPTABLE,
          message: Constants.String.Message.UNIQUE(
            Constants.String.Priority.NAME
          ),
        };
      await priorityModel.findOneAndUpdate(
        { _id: id, deleted: false },
        priority
      );
      const result = await priorityModel.findOne({ _id: id });
      return {
        status: Constants.ApiCode.SUCCESS,
        message: Constants.String.Message.PUT_200(Constants.String.Priority._),
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
  deletePriority: async (id) => {
    try {
      const deletedPriority = await priorityModel.findOneAndUpdate(
        { _id: id, deleted: false },
        { deleted: true }
      );
      if (!deletedPriority)
        return {
          status: Constants.ApiCode.NOT_FOUND,
          message: Constants.String.Message.ERR_404(
            Constants.String.Priority._
          ),
        };
      return {
        status: Constants.ApiCode.SUCCESS,
        message: Constants.String.Message.DELETE_200(
          Constants.String.Priority._
        ),
        data: deletedPriority,
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
  deletePriorities: async (ids) => {
    try {
      const deletedPriorities = await priorityModel.updateMany(
        { _id: { $in: ids }, deleted: false },
        { deleted: true }
      );
      if (deletedPriorities.modifiedCount === 0)
        return {
          status: Constants.ApiCode.NOT_FOUND,
          message: Constants.String.Message.ERR_404(
            Constants.String.Priority._
          ),
        };
      return {
        status: Constants.ApiCode.SUCCESS,
        message: Constants.String.Message.DELETE_200(
          Constants.String.Priority._
        ),
        data: deletedPriorities,
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

module.exports = priorityService;

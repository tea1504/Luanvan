require("dotenv").config();
const Constants = require("../constants");
const statusModel = require("./../models/status.model");
const { parse } = require("csv-parse/sync");

var statusService = {
  /**
   * @returns {import("./../interfaces").ResponseResult}
   */
  getList: async () => {
    try {
      const result = await statusModel.find(
        {
          deleted: false,
        },
        "name description"
      );
      return {
        status: Constants.ApiCode.SUCCESS,
        message: Constants.String.Message.GET_200(Constants.String.Status._),
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
   * @param {number} size
   * @param {number} page
   * @param {string} filter
   * @returns {import("./../interfaces").ResponseResult}
   */
  getStatuses: async (limit = 10, pageNumber = 1, filter = "") => {
    try {
      const result = {};
      const totalStatus = await statusModel.countDocuments({ deleted: false });
      let startIndex = (pageNumber - 1) * limit;
      let endIndex = pageNumber * limit;
      result.total = totalStatus;
      if (startIndex > 0) {
        result.previous = {
          pageNumber: pageNumber - 1,
          limit: limit,
        };
      }
      if (endIndex < totalStatus) {
        result.next = {
          pageNumber: pageNumber + 1,
          limit: limit,
        };
      }
      result.rowsPerPage = limit;
      result.data = await statusModel
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
        message: Constants.String.Message.GET_200(Constants.String.Status._),
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
   * @returns {import("./../interfaces").ResponseResult}
   */
  getStatus: async (id) => {
    try {
      const type = await statusModel.findOne({ _id: id, deleted: false });
      if (!type)
        return {
          status: Constants.ApiCode.NOT_FOUND,
          message: Constants.String.Message.ERR_404(Constants.String.Status._),
        };
      return {
        status: Constants.ApiCode.SUCCESS,
        message: Constants.String.Message.GET_200(Constants.String.Status._),
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
   * @param {import("./../interfaces").StatusModel} status
   * @returns {import("./../interfaces").ResponseResult}
   */
  post: async (status) => {
    try {
      const statusName = await statusModel.findOne({
        name: status.name,
        deleted: false,
      });
      if (statusName)
        return {
          status: Constants.ApiCode.NOT_ACCEPTABLE,
          message: Constants.String.Message.UNIQUE(
            Constants.String.Status.NAME
          ),
        };
      const newStatus = await statusModel.create(status);
      return {
        status: Constants.ApiCode.SUCCESS,
        message: Constants.String.Message.POST_200(Constants.String.Status._),
        data: newStatus,
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
  postStatuses: async (str) => {
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
        const itemName = await statusModel.findOne({
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
        const newItem = await statusModel.create(item);
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
   * @param {import("./../interfaces").StatusModel} status
   * @returns {import("./../interfaces").ResponseResult}
   */
  putStatus: async (id, status) => {
    try {
      const findStatus = await statusModel.findOne({ _id: id, deleted: false });
      if (!findStatus)
        return {
          status: Constants.ApiCode.NOT_FOUND,
          message: Constants.String.Message.ERR_404(Constants.String.Status._),
        };
      const statusName = await statusModel.findOne({
        _id: { $ne: id },
        name: status.name,
        deleted: false,
      });
      if (statusName)
        return {
          status: Constants.ApiCode.NOT_ACCEPTABLE,
          message: Constants.String.Message.UNIQUE(
            Constants.String.Status.NAME
          ),
        };
      await statusModel.findOneAndUpdate({ _id: id, deleted: false }, status);
      const result = await statusModel.findOne({ _id: id });
      return {
        status: Constants.ApiCode.SUCCESS,
        message: Constants.String.Message.PUT_200(Constants.String.Status._),
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
   * @returns {import("./../interfaces").ResponseResult}
   */
  deleteStatus: async (id) => {
    try {
      const deletedStatus = await statusModel.findOneAndUpdate(
        { _id: id, deleted: false },
        { deleted: true }
      );
      if (!deletedStatus)
        return {
          status: Constants.ApiCode.NOT_FOUND,
          message: Constants.String.Message.ERR_404(Constants.String.Status._),
        };
      return {
        status: Constants.ApiCode.SUCCESS,
        message: Constants.String.Message.DELETE_200(Constants.String.Status._),
        data: deletedStatus,
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
   * @returns {import("./../interfaces").ResponseResult}
   */
  deleteStatuses: async (ids) => {
    try {
      const deletedStatuses = await statusModel.updateMany(
        { _id: { $in: ids }, deleted: false },
        { deleted: true }
      );
      if (deletedStatuses.modifiedCount === 0)
        return {
          status: Constants.ApiCode.NOT_FOUND,
          message: Constants.String.Message.ERR_404(Constants.String.Status._),
        };
      return {
        status: Constants.ApiCode.SUCCESS,
        message: Constants.String.Message.DELETE_200(Constants.String.Status._),
        data: deletedStatuses,
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

module.exports = statusService;

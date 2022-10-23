const Constants = require("../constants");
const officerModel = require("../models/officer.model");
const model = require("./../models/incomingOfficialDispatch.model");

var incomingOfficialDispatchService = {
  getManyByUserOrgan: async (
    userID,
    limit = 10,
    pageNumber = 1,
    filter = ""
  ) => {
    try {
      const organID = await officerModel.findById(userID);
      const result = {};
      const total = await model.countDocuments({
        organ: organID.organ,
        deleted: false,
      });
      let startIndex = (pageNumber - 1) * limit;
      let endIndex = pageNumber * limit;
      result.total = total;
      if (startIndex > 0) {
        result.previous = {
          pageNumber: pageNumber - 1,
          limit: limit,
        };
      }
      if (endIndex < total) {
        result.next = {
          pageNumber: pageNumber + 1,
          limit: limit,
        };
      }
      result.rowsPerPage = limit;
      result.data = await model
        .find({
          organ: organID.organ,
          deleted: false,
        })
        .populate("type")
        .populate("language")
        .populate("priority")
        .populate("security")
        .populate("organ")
        .populate("approver")
        .populate("importer")
        .populate("handler")
        .populate("traceHeaderList.officer")
        .populate("traceHeaderList.status")
        .skip(startIndex)
        .limit(limit)
        .sort({ createdAt: -1 });
      return {
        status: Constants.ApiCode.SUCCESS,
        message: Constants.String.Message.GET_200(Constants.String.Language._),
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
  getOne: async (id) => {
    try {
      const item = await model
        .findOne({ _id: id, deleted: false })
        .populate("type")
        .populate("language")
        .populate("priority")
        .populate("security")
        .populate("organ")
        .populate("approver")
        .populate("importer")
        .populate("handler")
        .populate("traceHeaderList.officer")
        .populate("traceHeaderList.status");
      if (!item)
        return {
          status: Constants.ApiCode.NOT_FOUND,
          message: Constants.String.Message.ERR_404(Constants.String.IOD._),
        };
      return {
        status: Constants.ApiCode.SUCCESS,
        message: Constants.String.Message.GET_200(Constants.String.Language._),
        data: item,
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
  getFile: async (id) => {
    try {
      const item = await model
        .findOne({ "file._id": id, deleted: false })
        .populate("type")
        .populate("language")
        .populate("priority")
        .populate("security")
        .populate("organ")
        .populate("approver")
        .populate("importer")
        .populate("handler")
        .populate("traceHeaderList.officer")
        .populate("traceHeaderList.status");
      if (!item)
        return {
          status: Constants.ApiCode.NOT_FOUND,
          message: Constants.String.Message.ERR_404(Constants.String.IOD._),
        };
      var result = {};
      for (var i = 0; i < item.file.length; i++) {
        if (item.file[i]._id.toString() === id) result = item.file[i];
      }
      console.log(result);
      return {
        status: Constants.ApiCode.SUCCESS,
        message: Constants.String.Message.GET_200(Constants.String.Language._),
        data: result,
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

module.exports = incomingOfficialDispatchService;

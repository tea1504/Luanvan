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
};

module.exports = incomingOfficialDispatchService;

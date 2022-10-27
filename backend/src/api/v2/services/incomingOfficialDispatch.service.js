const Constants = require("../constants");
const officerModel = require("../models/officer.model");
const statusModel = require("../models/status.model");
const incomingOfficialDispatchModel = require("./../models/incomingOfficialDispatch.model");
const model = require("./../models/incomingOfficialDispatch.model");

var incomingOfficialDispatchService = {
  getManyByUserOrgan: async (
    userID,
    limit = 10,
    pageNumber = 1,
    filter = ""
  ) => {
    try {
      const user = await officerModel.findById(userID, { deleted: false });
      if (!user)
        return {
          status: Constants.ApiCode.NOT_FOUND,
          message: Constants.String.Message.ERR_404(Constants.String.Officer._),
        };
      const result = {};
      const total = await model.countDocuments({
        organ: user.organ,
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
          organ: user.organ,
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
  getNewArrivalNumber: async (userID) => {
    try {
      const date = new Date();
      const user = await officerModel.findById(userID, { deleted: false });
      if (!user)
        return {
          status: Constants.ApiCode.NOT_FOUND,
          message: Constants.String.Message.ERR_404(Constants.String.Officer._),
        };
      const IOD = await incomingOfficialDispatchModel
        .findOne({
          organ: user.organ,
          arrivalDate: {
            $gte: new Date(date.getFullYear() + "-1-1"),
            $lte: new Date(date.getFullYear() + "-12-31"),
          },
          deleted: false,
        })
        .sort({ arrivalNumber: -1 });
      if (!IOD)
        return {
          status: Constants.ApiCode.SUCCESS,
          message: Constants.String.Message.GET_200(
            Constants.String.IOD.ARRIVAL_NUMBER
          ),
          data: 1,
        };
      return {
        status: Constants.ApiCode.SUCCESS,
        message: Constants.String.Message.GET_200(
          Constants.String.IOD.ARRIVAL_NUMBER
        ),
        data: IOD.arrivalNumber + 1,
      };
    } catch (error) {
      return {
        status: Constants.ApiCode.INTERNAL_SERVER_ERROR,
        message: Constants.String.Message.ERR_500,
        data: { error: error.message },
      };
    }
  },
  postOne: async (id, data, files) => {
    try {
      data.importer = id;
      if (!data.approver || data.approver === "null") delete data.approver;
      data.arrivalDate = new Date().getTime();
      const status = await statusModel.findOne({
        name: "PENDING",
        deleted: false,
      });
      if (!status)
        return {
          status: Constants.ApiCode.NOT_FOUND,
          message: Constants.String.Message.ERR_404(Constants.String.Status._),
        };
      data.traceHeaderList = [];
      data.traceHeaderList.push({
        officer: id,
        command: status.description,
        date: new Date().getTime(),
        header: status.name,
        status: status._id.toString(),
      });
      data.file = [];
      console.log(files);
      files.map((el) => {
        data.file.push({
          name: el.originalname,
          path: "uploads/" + data.security + "/" + el.filename,
          typeFile: el.mimetype,
          size: el.size,
        });
      });
      const result = await model.create(data);
      return {
        status: Constants.ApiCode.SUCCESS,
        message: Constants.String.Message.POST_200(Constants.String.IOD._),
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
};

module.exports = incomingOfficialDispatchService;

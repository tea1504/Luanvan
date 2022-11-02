const Constants = require("../constants");
const officerModel = require("../models/officer.model");
const statusModel = require("../models/status.model");
const incomingOfficialDispatchModel = require("./../models/incomingOfficialDispatch.model");
const model = require("./../models/incomingOfficialDispatch.model");
var nodemailer = require("nodemailer");
const securityModel = require("../models/security.model");
const { default: mongoose } = require("mongoose");
var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

var incomingOfficialDispatchService = {
  getManyByUserOrgan: async (
    userID = "",
    limit = 10,
    pageNumber = 1,
    filter = "",
    params = {}
  ) => {
    try {
      const user = await officerModel.findById(userID, { deleted: false });
      if (!user)
        return {
          status: Constants.ApiCode.NOT_FOUND,
          message: Constants.String.Message.ERR_404(Constants.String.Officer._),
        };
      delete params.limit;
      delete params.pageNumber;
      delete params.filter;
      Object.keys(params).forEach(
        (el) => params[el] === "" && delete params[el]
      );
      var between = {};
      if (params.arrivalNumberStart)
        between.arrivalNumber = {
          $gte: parseInt(params.arrivalNumberStart),
          $lte: parseInt(params.arrivalNumberEnd),
        };
      if (params.issuedStartDate)
        between.issuedDate = {
          $gte: parseInt(params.issuedStartDate),
          $lte: parseInt(params.issuedEndDate),
        };
      if (params.arrivalNumber < 1) params.arrivalNumber = null;
      const khongMat = await securityModel.findOne({ name: "Không" });
      const result = {};
      const total = await model.countDocuments({
        organ: user.organ,
        deleted: false,
        ...params,
        ...between,
        // $or: [
        //   { security: khongMat._id.toString() },
        //   { importer: userID },
        //   { handler: userID },
        //   { approver: userID },
        // ],
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
          ...params,
          ...between,
          $or: [
            { security: khongMat._id.toString() },
            { importer: userID },
            { handler: { $all: [mongoose.Types.ObjectId(userID)] } },
            { approver: userID },
          ],
        })
        .populate("type")
        .populate("language")
        .populate("priority")
        .populate("security")
        .populate("organ")
        .populate("approver")
        .populate("importer")
        .populate("handler")
        .populate("status")
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
        .populate("status")
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
      const item = await model.findOne({ "file._id": id, deleted: false });
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
      data.status = status._id.toString();
      data.traceHeaderList = [];
      data.traceHeaderList.push({
        officer: id,
        command: status.description,
        date: new Date().getTime(),
        header: status.name,
        status: status._id.toString(),
      });
      data.file = [];
      files.map((el) => {
        data.file.push({
          name: el.originalname,
          path: "uploads/" + data.security + "/" + el.filename,
          typeFile: el.mimetype,
          size: el.size,
        });
      });
      const approver = await officerModel.findById(data.approver, {
        deleted: false,
      });
      if (data.sendEmail === "true") {
        var mailOptions = {
          from: process.env.MAIL_USER,
          to: approver.emailAddress,
          subject: "email_title",
          html: `<img src="https://imggroup.com.vn/Content/images/logo-img.png" height="100"/>
          <br/>
          <span style="width: 100%; font-family: Tahoma,Geneva, sans-serif;">
              Bạn có 1 văn bản cần duyệt
          </span>
`,
        };
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log("Email sent: " + info.response);
          }
        });
      }
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
  approval: async (
    id = "",
    userID = "",
    data = { handler: [], sendEmail: true, description: "", arrivalNumber: 0 }
  ) => {
    try {
      const item = await model.findOne({
        _id: id,
        deleted: false,
      });
      if (!item)
        return {
          status: Constants.ApiCode.NOT_FOUND,
          message: Constants.String.Message.ERR_404(Constants.String.IOD._),
        };
      const user = await officerModel.findById(userID, { deleted: false });
      if (!user)
        return {
          status: Constants.ApiCode.NOT_FOUND,
          message: Constants.String.Message.ERR_404(Constants.String.Officer._),
        };
      const APPROVED = await statusModel.findOne({
        name: "APPROVED",
        deleted: false,
      });
      const PROGRESSING = await statusModel.findOne({
        name: "PROGRESSING",
        deleted: false,
      });
      item.traceHeaderList.push({
        date: new Date(),
        status: APPROVED._id.toString(),
        officer: user._id.toString(),
        command: `${user.lastName} ${user.firstName} đã duyệt văn bản`,
        header: APPROVED.name,
      });
      if (data.handler.length === 0) {
        if (!APPROVED)
          return {
            status: Constants.ApiCode.NOT_FOUND,
            message: Constants.String.Message.ERR_404(
              Constants.String.Status._
            ),
          };
        item.status = APPROVED._id.toString();
      } else {
        if (!PROGRESSING)
          return {
            status: Constants.ApiCode.NOT_FOUND,
            message: Constants.String.Message.ERR_404(
              Constants.String.Status._
            ),
          };
        item.handler = data.handler;
        item.status = PROGRESSING._id.toString();
        item.traceHeaderList.push({
          date: new Date(),
          status: PROGRESSING._id.toString(),
          officer: user._id.toString(),
          command: `${user.lastName} ${user.firstName} đã phân công xử lý`,
          header: PROGRESSING.name,
        });
      }
      item.arrivalNumber = data.arrivalNumber;
      item.description = data.description;
      item.save();
      return {
        status: Constants.ApiCode.SUCCESS,
        message: Constants.String.Message.PUT_200(Constants.String.Language._),
        data: item,
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
};

module.exports = incomingOfficialDispatchService;

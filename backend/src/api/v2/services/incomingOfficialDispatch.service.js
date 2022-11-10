const Constants = require("../constants");
const officerModel = require("../models/officer.model");
const statusModel = require("../models/status.model");
const incomingOfficialDispatchModel = require("./../models/incomingOfficialDispatch.model");
const model = require("./../models/incomingOfficialDispatch.model");
const path = require("path");
var fs = require("fs");
var nodemailer = require("nodemailer");
const securityModel = require("../models/security.model");
const { default: mongoose } = require("mongoose");
const showError = require("./error.service");
const organizationModel = require("../models/organization.model");
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
      const statusCheck = await statusModel.find(
        { name: { $in: ["PENDING", "PROGRESSING"] } },
        "_id"
      );
      const lateStatus = await statusModel.findOne({ name: "LATE" });
      const findLatedIOD = await model.find({
        deleted: false,
        dueDate: { $lt: new Date() },
        status: { $in: [...statusCheck] },
      });
      await model.updateMany(
        { _id: { $in: [...findLatedIOD.map((el) => el._id)] } },
        { status: lateStatus._id }
      );
      const user = await officerModel.findById(userID, { deleted: false });
      if (!user)
        return {
          status: Constants.ApiCode.NOT_FOUND,
          message: Constants.String.Message.ERR_404(Constants.String.Officer._),
        };
      const listUser = await officerModel.find({
        deleted: false,
        organ: user.organ,
      });
      delete params.limit;
      delete params.pageNumber;
      delete params.filter;
      Object.keys(params).forEach(
        (el) => params[el] === "" && delete params[el]
      );
      var between = {};
      if (params.arrivalNumberStart) {
        between.arrivalNumber = {
          $gte: parseInt(params.arrivalNumberStart),
          $lte: parseInt(params.arrivalNumberEnd),
        };
        delete params.arrivalNumberStart;
        delete params.arrivalNumberEnd;
      }
      if (params.issuedStartDate) {
        between.issuedDate = {
          $gte: parseInt(params.issuedStartDate),
          $lte: parseInt(params.issuedEndDate),
        };
        delete params.issuedStartDate;
        delete params.issuedEndDate;
      }
      if (params.arrivalNumber < 1) params.arrivalNumber = null;
      if (params.typeMulti) {
        between.type = { $in: params.typeMulti.split(",") };
        delete params.type;
        delete params.typeMulti;
      }
      if (params.statusMulti) {
        between.status = { $in: params.statusMulti.split(",") };
        delete params.status;
        delete params.statusMulti;
      }
      if (params.organMulti) {
        between.organ = { $in: params.organMulti.split(",") };
        delete params.organMulti;
      }
      if (params.handler) {
        between.handler = { $in: params.handler.split(",") };
        delete params.handler;
      }
      if (params.approver) {
        between.approver = { $in: params.approver.split(",") };
        delete params.approver;
      }
      if (params.approver_importer) {
        between["$or"] = [
          { approver: params.approver_importer },
          { importer: params.approver_importer },
        ];
        delete params.approver_importer;
      }
      if (params.importer) {
        between.importer = { $in: params.importer.split(",") };
        delete params.importer;
      }
      const khongMat = await securityModel.findOne({ name: "Không" });
      const result = {};
      const total = await model.countDocuments({
        importer: { $in: [...listUser].map((el) => el._id) },
        deleted: false,
        ...params,
        ...between,
        $or: [
          { security: khongMat._id.toString() },
          { importer: userID },
          { handler: { $all: [mongoose.Types.ObjectId(userID)] } },
          { approver: userID },
        ],
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
          importer: { $in: [...listUser].map((el) => el._id) },
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
        .sort({ arrivalDate: -1, arrivalNumber: -1 });
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
      const statusCheck = await statusModel.find(
        { name: { $in: ["PENDING", "PROGRESSING"] } },
        "_id"
      );
      const lateStatus = await statusModel.findOne({ name: "LATE" });
      const findLatedIOD = await model.find({
        deleted: false,
        dueDate: { $lt: new Date() },
        status: { $in: [...statusCheck] },
      });
      await model.updateMany(
        { _id: { $in: [...findLatedIOD.map((el) => el._id)] } },
        { status: lateStatus._id }
      );
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
  getNewArrivalNumber: async (userID = "") => {
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
  postOne: async (
    userID = "",
    data = {
      code: "",
      issuedDate: 0,
      subject: "",
      type: "",
      language: "",
      pageAmount: 0,
      description: "",
      signerInfoName: "",
      signerInfoPosition: "",
      dueDate: 0,
      priority: "",
      security: "",
      organ: "",
      approver: "",
      handler: [],
      sendEmail: "",
    },
    files = []
  ) => {
    try {
      data.importer = userID;
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
        officer: userID,
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
      return showError(error);
    }
  },
  putOne: async (
    id = "",
    userID = "",
    data = {
      code: "",
      issuedDate: 0,
      subject: "",
      type: "",
      language: "",
      pageAmount: 0,
      description: "",
      signerInfoName: "",
      signerInfoPosition: "",
      dueDate: 0,
      priority: "",
      security: "",
      organ: "",
      approver: "",
      handler: [],
      fileTemp: [],
      sendEmail: "",
    },
    files = []
  ) => {
    try {
      if (!data.fileTemp) data.fileTemp = [];
      const user = await officerModel.findById(userID, { deleted: false });
      if (!user)
        return {
          status: Constants.ApiCode.NOT_FOUND,
          message: Constants.String.Message.ERR_404(Constants.String.Officer._),
        };
      const iod = await model.findById(id, { deleted: false });
      if (!iod)
        return {
          status: Constants.ApiCode.NOT_FOUND,
          message: Constants.String.Message.ERR_404(Constants.String.Officer._),
        };
      if (data.organ) iod.organ = data.organ;
      if (data.issuedDate) iod.issuedDate = data.issuedDate;
      if (data.code) iod.code = data.code;
      if (data.language) iod.language = data.language;
      if (data.type) iod.type = data.type;
      if (data.priority) iod.priority = data.priority;
      if (data.security) iod.security = data.security;
      if (data.subject) iod.subject = data.subject;
      if (data.signerInfoName) iod.signerInfoName = data.signerInfoName;
      if (data.signerInfoPosition)
        iod.signerInfoPosition = data.signerInfoPosition;
      if (data.pageAmount) iod.pageAmount = data.pageAmount;
      if (data.dueDate) iod.dueDate = data.dueDate;
      if (data.approver) iod.approver = data.approver;
      const file = [...iod.file].filter(
        (el) => ![...data.fileTemp].includes(el._id.toString())
      );
      iod.file = [...iod.file].filter((el) =>
        [...data.fileTemp].includes(el._id.toString())
      );
      files.map((el) => {
        iod.file.push({
          name: el.originalname,
          path: "uploads/" + data.security + "/" + el.filename,
          typeFile: el.mimetype,
          size: el.size,
        });
      });
      file.map((el) => {
        const pathFile = path.join(__dirname, "./../../../../public/", el.path);
        if (fs.existsSync(pathFile)) fs.unlinkSync(pathFile);
      });
      iod.save();
      return {
        status: Constants.ApiCode.SUCCESS,
        message: Constants.String.Message.PUT_200(Constants.String.IOD._),
        data: iod,
      };
    } catch (error) {
      return showError(error);
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
      showError(error);
    }
  },
  cancelApproval: async (
    id = "",
    userID = "",
    data = { cancel: "", sendEmail: true }
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
      const PENDING = await statusModel.findOne({
        name: "PENDING",
        deleted: false,
      });
      item.traceHeaderList.push({
        date: new Date(),
        status: PENDING._id,
        officer: user._id,
        command: data.cancel,
        header: PENDING.name,
      });
      item.status = PENDING._id;
      const handler = await officerModel.find({ _id: { $in: item.handler } });
      item.handler = [];
      item.arrivalNumber = null;
      item.save();
      if (data.sendEmail || data.sendEmail !== "false") {
        var mailOptions = {
          from: process.env.MAIL_USER,
          bcc: [
            user.emailAddress,
            ...handler.map((el) => el.emailAddress),
          ].join(","),
          subject: "[E-OFFICE] VĂN BẢN BỊ HỦY",
          html: `<img src="https://imggroup.com.vn/Content/images/logo-img.png" height="100"/>
          <br/>
          <span style="width: 100%; font-family: Tahoma,Geneva, sans-serif;">
              ${data.cancel}
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
      return {
        status: Constants.ApiCode.SUCCESS,
        message: Constants.String.Message.PUT_200(Constants.String.Language._),
        data: item,
      };
    } catch (error) {
      return showError(error);
    }
  },
  handle: async (
    id = "",
    userID = "",
    data = { done: false, newHandler: [], command: "", sendEmail: [] },
    files = []
  ) => {
    try {
      if (!data.command) data.command = "";
      if (!data.newHandler) data.newHandler = [];
      else if (
        typeof data.newHandler === "string" ||
        data.newHandler instanceof String
      )
        data.newHandler = [data.newHandler];
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
      var status;
      if (data.done === "true")
        status = await statusModel.findOne({
          name: "PROGRESSED",
          deleted: false,
        });
      else
        status = await statusModel.findOne({
          name: "PROGRESSING",
          deleted: false,
        });
      item.traceHeaderList.push({
        date: new Date(),
        status: status._id.toString(),
        officer: user._id.toString(),
        command: `${user.lastName} ${user.firstName} cho ý kiến ${data.command}`,
        header: status.name,
      });
      item.status = status._id.toString();
      item.handler.push(...data.newHandler);
      files.map((el) => {
        item.file.push({
          name: el.originalname,
          path: "uploads/" + item.security + "/" + el.filename,
          typeFile: el.mimetype,
          size: el.size,
        });
      });
      item.save();
      const result = await model
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
      const listOfficer = await officerModel.find({
        _id: { $in: [...data.sendEmail, ...data.newHandler] },
      });
      const listEmail = listOfficer.map((el) => el.emailAddress);
      console.log(listEmail, data.newHandler, [
        ...data.sendEmail,
        ...data.newHandler,
      ]);
      if (listEmail.length !== 0) {
        var mailOptions = {
          from: process.env.MAIL_USER,
          bcc: listEmail.join(", "),
          subject: "email_title",
          html: `<img src="https://imggroup.com.vn/Content/images/logo-img.png" height="100"/>
          <br/>
          <span style="width: 100%; font-family: Tahoma,Geneva, sans-serif;">
              Bạn có <strong>1 thông báo</strong> xử lý văn bản
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
      return {
        status: Constants.ApiCode.SUCCESS,
        message: Constants.String.Message.PUT_200(Constants.String.Language._),
        data: result,
      };
    } catch (error) {
      showError(error);
    }
  },
  refuse: async (
    id = "",
    userID = "",
    data = { refuse: "", sendEmailImporter: "", sendEmailOrgan: "" }
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
      const REFUSE = await statusModel.findOne({
        name: "REFUSE",
        deleted: false,
      });
      if (!REFUSE)
        return {
          status: Constants.ApiCode.NOT_FOUND,
          message: Constants.String.Message.ERR_404(Constants.String.Status._),
        };
      item.status = REFUSE._id;
      item.traceHeaderList.push({
        command: data.refuse,
        header: REFUSE.name,
        officer: user._id,
        status: REFUSE._id,
      });
      item.save();
      if (data.sendEmailImporter || data.sendEmailImporter !== "false") {
        var mailOptions = {
          from: process.env.MAIL_USER,
          to: user.emailAddress,
          subject: "email_title",
          html: `<img src="https://imggroup.com.vn/Content/images/logo-img.png" height="100"/>
          <br/>
          <span style="width: 100%; font-family: Tahoma,Geneva, sans-serif;">
              Bạn có <strong>${data.refuse}</strong> xử lý văn bản
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
      if (data.sendEmailOrgan || data.sendEmailOrgan !== "false") {
        const organ = await organizationModel.findById(user.organ);
        var mailOptions = {
          from: process.env.MAIL_USER,
          to: organ.emailAddress,
          subject: "email_title",
          html: `<img src="https://imggroup.com.vn/Content/images/logo-img.png" height="100"/>
          <br/>
          <span style="width: 100%; font-family: Tahoma,Geneva, sans-serif;">
              Bạn có <strong>${data.refuse}</strong> xử lý văn bản
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
      return {
        status: Constants.ApiCode.SUCCESS,
        message: Constants.String.Message.PUT_200(Constants.String.Language._),
        data: item,
      };
    } catch (error) {
      showError(error);
    }
  },
  implement: async (
    id = "",
    userID = "",
    data = { implement: "", sendEmail: "" }
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
      const IMPLEMENT = await statusModel.findOne({
        name: "IMPLEMENT",
        deleted: false,
      });
      if (!IMPLEMENT)
        return {
          status: Constants.ApiCode.NOT_FOUND,
          message: Constants.String.Message.ERR_404(Constants.String.Status._),
        };
      item.status = IMPLEMENT._id;
      item.traceHeaderList.push({
        command: data.implement,
        header: IMPLEMENT.name,
        officer: user._id,
        status: IMPLEMENT._id,
      });
      item.save();
      const importer = await officerModel.findById(item.importer);
      if (data.sendEmail || data.sendEmail !== "false") {
        var mailOptions = {
          from: process.env.MAIL_USER,
          to: importer.emailAddress,
          subject: "email_title",
          html: `<img src="https://imggroup.com.vn/Content/images/logo-img.png" height="100"/>
          <br/>
          <span style="width: 100%; font-family: Tahoma,Geneva, sans-serif;">
              ${data.implement}
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
      return {
        status: Constants.ApiCode.SUCCESS,
        message: Constants.String.Message.PUT_200(Constants.String.Language._),
        data: item,
      };
    } catch (error) {
      showError(error);
    }
  },
  deleteOne: async (id = "", userID = "") => {
    try {
      const item = await model.findOneAndUpdate(
        { _id: id, deleted: false },
        { deleted: true }
      );
      if (!item)
        return {
          status: Constants.ApiCode.NOT_FOUND,
          message: Constants.String.Message.ERR_404(Constants.String.IOD._),
        };
      item.file.map((el) => {
        const pathFile = path.join(__dirname, "./../../../../public/", el.path);
        if (fs.existsSync(pathFile)) fs.unlinkSync(pathFile);
      });
      return {
        status: Constants.ApiCode.SUCCESS,
        message: Constants.String.Message.DELETE_200(Constants.String.IOD._),
        data: item,
      };
    } catch (error) {
      return showError(error);
    }
  },
  deleteMany: async (ids) => {
    try {
      const items = await model.updateMany(
        { _id: { $in: ids }, deleted: false },
        { deleted: true }
      );
      if (items.modifiedCount === 0)
        return {
          status: Constants.ApiCode.NOT_FOUND,
          message: Constants.String.Message.ERR_404(Constants.String.Officer._),
        };
      const listItems = await model.find({ _id: { $in: ids } });
      listItems.map((el) => {
        el.file.map((f) => {
          const pathFile = path.join(
            __dirname,
            "./../../../../public/",
            f.path
          );
          if (fs.existsSync(pathFile)) fs.unlinkSync(pathFile);
        });
      });
      return {
        status: Constants.ApiCode.SUCCESS,
        message: Constants.String.Message.DELETE_200(Constants.String.IOD._),
        data: items,
      };
    } catch (error) {
      return showError(error);
    }
  },
};

module.exports = incomingOfficialDispatchService;

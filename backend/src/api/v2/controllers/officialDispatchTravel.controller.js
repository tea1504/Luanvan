const Constants = require("../constants");
const service = require("../services/officialDispatchTravel.service");
var fs = require("fs");
const path = require("path");

var officialDispatchTravelController = {
  /**
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @param {import("express").RequestHandler} next
   */
  getManyByUserOrgan: async (req, res, next) => {
    try {
      const { pageNumber, limit, filter } = req.query;
      const result = await service.getManyByUserOrgan(
        req.userID,
        parseInt(limit),
        parseInt(pageNumber),
        filter,
        req.query
      );
      return res.status(result.status).json(result);
    } catch (error) {
      return next(error);
    }
  },
  /**
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @param {import("express").RequestHandler} next
   */
  getOne: async (req, res, next) => {
    try {
      const { id } = req.params;
      list = id.split(".");
      const result = await service.getOne(req.userID, list[list.length - 1]);
      return res.status(result.status).json(result);
    } catch (error) {
      return next(error);
    }
  },
  /**
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @param {import("express").RequestHandler} next
   */
  getFile: async (req, res, next) => {
    try {
      const { id } = req.params;
      list = id.split(".");
      const result = await service.getFile(list[list.length - 1]);
      const file = path.join(__dirname, "../../../../public", result.data.path);
      return res.status(result.status).download(file, result.data.name);
    } catch (error) {
      return next(error);
    }
  },
  /**
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @param {import("express").RequestHandler} next
   */
  getNewCode: async (req, res, next) => {
    try {
      const result = await service.getNewCode(req.userID);
      return res.status(result.status).json(result);
    } catch (error) {
      return next(error);
    }
  },
  /**
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @param {import("express").RequestHandler} next
   */
  postOne: async (req, res, next) => {
    try {
      const files = req.files;
      var {
        subject,
        type,
        language,
        pageAmount,
        issuedAmount,
        description,
        signerInfoName,
        signerInfoPosition,
        dueDate,
        priority,
        security,
        organ,
        approver,
        sendEmail,
      } = req.body;
      if (!language)
        return res.status(Constants.ApiCode.BAD_REQUEST).json({
          status: Constants.ApiCode.BAD_REQUEST,
          message: Constants.String.Message.ERR_400(
            Constants.String.IOD.LANGUAGE
          ),
        });
      if (!organ)
        return res.status(Constants.ApiCode.BAD_REQUEST).json({
          status: Constants.ApiCode.BAD_REQUEST,
          message: Constants.String.Message.ERR_400(Constants.String.IOD.ORGAN),
        });
      if (!priority)
        return res.status(Constants.ApiCode.BAD_REQUEST).json({
          status: Constants.ApiCode.BAD_REQUEST,
          message: Constants.String.Message.ERR_400(
            Constants.String.IOD.PRIORITY
          ),
        });
      if (!security)
        return res.status(Constants.ApiCode.BAD_REQUEST).json({
          status: Constants.ApiCode.BAD_REQUEST,
          message: Constants.String.Message.ERR_400(
            Constants.String.IOD.SECURITY
          ),
        });
      if (!type)
        return res.status(Constants.ApiCode.BAD_REQUEST).json({
          status: Constants.ApiCode.BAD_REQUEST,
          message: Constants.String.Message.ERR_400(Constants.String.IOD.TYPE),
        });
      const result = await service.postOne(
        req.userID,
        {
          subject,
          type,
          language,
          pageAmount,
          issuedAmount,
          description,
          signerInfoName,
          signerInfoPosition,
          dueDate,
          priority,
          security,
          organ,
          approver,
          sendEmail,
        },
        files
      );
      return res.status(result.status).json(result);
    } catch (error) {
      return next(error);
    }
  },
  /**
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @param {import("express").RequestHandler} next
   */
  putOne: async (req, res, next) => {
    try {
      const files = req.files;
      const { id } = req.params;
      const list = id.split(".");
      var {
        dueDate,
        fileTemp,
        code,
        issuedDate,
        subject,
        type,
        language,
        pageAmount,
        issuedAmount,
        description,
        signerInfoName,
        signerInfoPosition,
        priority,
        security,
        organ,
        approver,
        sendEmail,
      } = req.body;
      const result = await service.putOne(
        list[list.length - 1],
        req.userID,
        {
          dueDate,
          fileTemp,
          code,
          issuedDate,
          subject,
          type,
          language,
          pageAmount,
          issuedAmount,
          description,
          signerInfoName,
          signerInfoPosition,
          priority,
          security,
          organ,
          approver,
          sendEmail,
        },
        files
      );
      return res.status(result.status).json(result);
    } catch (error) {
      return next(error);
    }
  },
  /**
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @param {import("express").RequestHandler} next
   */
  approval: async (req, res, next) => {
    try {
      const { id } = req.params;
      const list = id.split(".");
      var { code, description } = req.body;
      const result = await service.approval(list[list.length - 1], req.userID, {
        description,
        code,
      });
      return res.status(result.status).json(result);
    } catch (error) {
      return next(error);
    }
  },
  /**
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @param {import("express").RequestHandler} next
   */
  cancelApproval: async (req, res, next) => {
    try {
      const { id } = req.params;
      const list = id.split(".");
      const { cancel, sendEmail } = req.body;
      const result = await service.cancelApproval(
        list[list.length - 1],
        req.userID,
        { cancel, sendEmail }
      );
      return res.status(result.status).json(result);
    } catch (error) {
      return next(error);
    }
  },
  /**
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @param {import("express").RequestHandler} next
   */
  handle: async (req, res, next) => {
    try {
      const { id } = req.params;
      const list = id.split(".");
      const files = req.files;
      var { newHandler, done, command, sendEmail } = req.body;
      const result = await service.handle(
        list[list.length - 1],
        req.userID,
        {
          newHandler,
          done,
          command,
          sendEmail,
        },
        files
      );
      return res.status(result.status).json(result);
    } catch (error) {
      return next(error);
    }
  },
  /**
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @param {import("express").RequestHandler} next
   */
  refuse: async (req, res, next) => {
    try {
      const { id } = req.params;
      const list = id.split(".");
      var { refuse, sendEmailImporter, sendEmailOrgan } = req.body;
      const result = await service.refuse(list[list.length - 1], req.userID, {
        refuse,
        sendEmailImporter,
        sendEmailOrgan,
      });
      return res.status(result.status).json(result);
    } catch (error) {
      return next(error);
    }
  },
  /**
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @param {import("express").RequestHandler} next
   */
  implement: async (req, res, next) => {
    try {
      const { id } = req.params;
      const list = id.split(".");
      var { implement, sendEmail } = req.body;
      const result = await service.implement(
        list[list.length - 1],
        req.userID,
        {
          implement,
          sendEmail,
        }
      );
      return res.status(result.status).json(result);
    } catch (error) {
      return next(error);
    }
  },
  /**
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @param {import("express").RequestHandler} next
   */
  deleteOne: async (req, res, next) => {
    try {
      const { id } = req.params;
      list = id.split(".");
      const result = await service.deleteOne(list[list.length - 1], req.userID);
      return res.status(result.status).json(result);
    } catch (error) {
      return next(error);
    }
  },
  /**
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @param {import("express").RequestHandler} next
   */
  deleteMany: async (req, res, next) => {
    try {
      const { ids } = req.body;
      const result = await service.deleteMany(ids);
      return res.status(result.status).json(result);
    } catch (error) {
      return next(error);
    }
  },
  /**
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @param {import("express").RequestHandler} next
   */
  report: async (req, res, next) => {
    try {
      const { end, start } = req.query;
      const result = await service.report(req.userID, start, end);
      return res.status(result.status).json(result);
    } catch (error) {
      return next(error);
    }
  },
  /**
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @param {import("express").RequestHandler} next
   */
  getYearReport: async (req, res, next) => {
    try {
      const result = await service.getYearReport(req.userID);
      return res.status(result.status).json(result);
    } catch (error) {
      return next(error);
    }
  },
  /**
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @param {import("express").RequestHandler} next
   */
  getStatisticYearPerMonth: async (req, res, next) => {
    try {
      const { year } = req.query;
      const result = await service.getStatisticYearPerMonth(
        req.userID,
        parseInt(year)
      );
      return res.status(result.status).json(result);
    } catch (error) {
      return next(error);
    }
  },
  /**
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @param {import("express").RequestHandler} next
   */
  getStatisticMonth: async (req, res, next) => {
    try {
      const { year, month } = req.query;
      const result = await service.getStatisticMonth(
        req.userID,
        parseInt(year),
        parseInt(month)
      );
      return res.status(result.status).json(result);
    } catch (error) {
      return next(error);
    }
  },
  /**
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @param {import("express").RequestHandler} next
   */
  getStatisticTypeYear: async (req, res, next) => {
    try {
      const { year } = req.query;
      const result = await service.getStatisticTypeYear(
        req.userID,
        parseInt(year)
      );
      return res.status(result.status).json(result);
    } catch (error) {
      return next(error);
    }
  },
};

module.exports = officialDispatchTravelController;

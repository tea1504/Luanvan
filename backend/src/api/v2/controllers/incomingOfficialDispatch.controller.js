const Constants = require("../constants");
const service = require("./../services/incomingOfficialDispatch.service");
var fs = require("fs");
const path = require("path");

var incomingOfficialDispatchController = {
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
      const result = await service.getOne(list[list.length - 1]);
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
  getNewArrivalNumber: async (req, res, next) => {
    try {
      const result = await service.getNewArrivalNumber(req.userID);
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
        code,
        issuedDate,
        subject,
        type,
        language,
        pageAmount,
        description,
        signerInfoName,
        signerInfoPosition,
        dueDate,
        priority,
        security,
        organ,
        approver,
        handler,
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
      if (!handler) handler = [];
      const result = await service.postOne(
        req.userID,
        {
          code,
          issuedDate,
          subject,
          type,
          language,
          pageAmount,
          description,
          signerInfoName,
          signerInfoPosition,
          dueDate,
          priority,
          security,
          organ,
          approver,
          handler,
          sendEmail,
        },
        files
      );
      return res.status(result.status).json(result);
    } catch (error) {
      return next(error);
    }
  },
};

module.exports = incomingOfficialDispatchController;

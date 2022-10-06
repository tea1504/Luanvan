const Constants = require("../constants");
const officerStatusService = require("./../services/officerStatus.service");
var fs = require("fs");

var officerStatusController = {
  /**
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @param {import("express").RequestHandler} next
   */
  getOfficerStatuses: async (req, res, next) => {
    try {
      const { pageNumber, limit, filter } = req.query;
      const result = await officerStatusService.getOfficerStatuses(
        parseInt(limit),
        parseInt(pageNumber),
        filter
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
  getOfficerStatus: async (req, res, next) => {
    try {
      const { id } = req.params;
      list = id.split(".");
      const result = await officerStatusService.getOfficerStatus(
        list[list.length - 1]
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
  postOfficerStatus: async (req, res, next) => {
    try {
      const { name, description, color } = req.body;
      if (!name)
        return res.status(Constants.ApiCode.BAD_REQUEST).json({
          status: Constants.ApiCode.BAD_REQUEST,
          message: Constants.String.Message.ERR_400(
            Constants.String.OfficerStatus.NAME
          ),
        });
      const result = await officerStatusService.post({
        name,
        description,
        color,
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
  postOfficerStatuses: async (req, res, next) => {
    try {
      const file = req.file;
      const { text, title } = req.body;
      if (file) {
        const data = fs.readFileSync(file.path);
        const index = data.toString().indexOf("\n");
        var t = data.toString();
        if (title === "true") t = t.slice(index + 1);
        const result = await officerStatusService.postOfficerStatuses(t);
        fs.unlinkSync(file.path);
        return res.status(result.status).json(result);
      } else {
        const result = await officerStatusService.postOfficerStatuses(text);
        return res.status(result.status).json(result);
      }
    } catch (error) {
      return next(error);
    }
  },
  /**
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @param {import("express").RequestHandler} next
   */
  putOfficerStatus: async (req, res, next) => {
    try {
      const { id } = req.params;
      list = id.split(".");
      const { name, description, color } = req.body;
      if (!name)
        return res.status(Constants.ApiCode.BAD_REQUEST).json({
          status: Constants.ApiCode.BAD_REQUEST,
          message: Constants.String.Message.ERR_400(
            Constants.String.OfficerStatus.NAME
          ),
        });
      const result = await officerStatusService.putOfficerStatus(
        list[list.length - 1],
        {
          name,
          description,
          color,
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
  deleteOfficerStatus: async (req, res, next) => {
    try {
      const { id } = req.params;
      list = id.split(".");
      const result = await officerStatusService.deleteOfficerStatus(
        list[list.length - 1]
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
  deleteOfficerStatuses: async (req, res, next) => {
    try {
      const { ids } = req.body;
      console.log(ids);
      const result = await officerStatusService.deleteOfficerStatuses(ids);
      return res.status(result.status).json(result);
    } catch (error) {
      return next(error);
    }
  },
};

module.exports = officerStatusController;

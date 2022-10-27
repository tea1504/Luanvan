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
};

module.exports = incomingOfficialDispatchController;

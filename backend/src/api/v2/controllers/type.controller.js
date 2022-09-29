const Constants = require("../constants");
const typeService = require("./../services/type.service");

var typeController = {
  /**
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @param {import("express").RequestHandler} next
   */
  getTypes: async (req, res, next) => {
    try {
      const { pageNumber, limit, filter } = req.query;
      const result = await typeService.getTypes(
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
  post: async (req, res, next) => {
    try {
      const { name, notation, description, color } = req.body;
      if (!name)
        return res.status(400).json({
          status: 400,
          message: Constants.String.Message.ERR_400(Constants.String.Type.NAME),
        });
      if (!notation)
        return res.status(400).json({
          status: 400,
          message: Constants.String.Message.ERR_400(
            Constants.String.Type.NOTATION
          ),
        });
      const result = await typeService.post({
        name,
        notation,
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
  getType: async (req, res, next) => {
    try {
      const { id } = req.params;
      list = id.split(".");
      const result = await typeService.getType(list[list.length - 1]);
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
  putType: async (req, res, next) => {
    try {
      const { id } = req.params;
      list = id.split(".");
      const { name, notation, description, color } = req.body;
      if (!name)
        return res.status(400).json({
          status: 400,
          message: Constants.String.Message.ERR_400(Constants.String.Type.NAME),
        });
      if (!notation)
        return res.status(400).json({
          status: 400,
          message: Constants.String.Message.ERR_400(
            Constants.String.Type.NOTATION
          ),
        });
      const result = await typeService.putType(list[list.length - 1], {
        name,
        notation,
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
  deleteType: async (req, res, next) => {
    try {
      const { id } = req.params;
      list = id.split(".");
      const result = await typeService.deleteType(list[list.length - 1]);
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
  deleteTypes: async (req, res, next) => {
    try {
      const { ids } = req.body;
      const result = await typeService.deleteTypes(ids);
      return res.status(result.status).json(result);
    } catch (error) {
      return next(error);
    }
  },
};

module.exports = typeController;

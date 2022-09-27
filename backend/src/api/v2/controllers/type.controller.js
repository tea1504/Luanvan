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
      const pageNumber = parseInt(req.query.pageNumber) || 1;
      const limit = parseInt(req.query.limit) || 2;
      const result = await typeService.getTypes(limit, pageNumber);
      res.status(result.code).json(result);
    } catch (error) {
      next(error);
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
        res.status(400).json({
          code: 400,
          message: Constants.String.Message.ERR_400(Constants.String.Type.NAME),
        });
      if (!notation)
        res.status(400).json({
          code: 400,
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
      res.status(result.code).json(result);
    } catch (error) {
      next(error);
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
      res.status(result.code).json(result);
    } catch (error) {
      next(error);
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
        res.status(400).json({
          code: 400,
          message: Constants.String.Message.ERR_400(Constants.String.Type.NAME),
        });
      if (!notation)
        res.status(400).json({
          code: 400,
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
      res.status(result.code).json(result);
    } catch (error) {
      next(error);
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
      res.status(result.code).json(result);
    } catch (error) {
      next(error);
    }
  },
};

module.exports = typeController;

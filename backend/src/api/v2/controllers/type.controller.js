const Constants = require("../constants");
const typeService = require("./../services/type.service");
var fs = require("fs");
const { promisify } = require("util");
const path = require("path");
const unlinkAsync = promisify(fs.unlink);

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
        return res.status(Constants.ApiCode.BAD_REQUEST).json({
          status: Constants.ApiCode.BAD_REQUEST,
          message: Constants.String.Message.ERR_400(Constants.String.Type.NAME),
        });
      if (!notation)
        return res.status(Constants.ApiCode.BAD_REQUEST).json({
          status: Constants.ApiCode.BAD_REQUEST,
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
  postTypes: async (req, res, next) => {
    try {
      const file = req.file;
      const { text, title } = req.body;
      if (file) {
        const data = fs.readFileSync(file.path);
        const index = data.toString().indexOf("\n");
        var t = data.toString();
        if (title === "true") t = t.slice(index + 1);
        const result = await typeService.postTypes(t);
        fs.unlinkSync(file.path);
        return res.status(result.status).json(result);
      } else {
        const result = await typeService.postTypes(text);
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
        return res.status(Constants.ApiCode.BAD_REQUEST).json({
          status: Constants.ApiCode.BAD_REQUEST,
          message: Constants.String.Message.ERR_400(Constants.String.Type.NAME),
        });
      if (!notation)
        return res.status(Constants.ApiCode.BAD_REQUEST).json({
          status: Constants.ApiCode.BAD_REQUEST,
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

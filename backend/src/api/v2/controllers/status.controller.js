const Constants = require("../constants");
const statusService = require("./../services/status.service");
var fs = require("fs");

var statusController = {
  /**
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @param {import("express").RequestHandler} next
   */
  getList: async (req, res, next) => {
    try {
      const result = await statusService.getList();
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
  getStatuses: async (req, res, next) => {
    try {
      const { pageNumber, limit, filter } = req.query;
      const result = await statusService.getStatuses(
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
  getStatus: async (req, res, next) => {
    try {
      const { id } = req.params;
      list = id.split(".");
      const result = await statusService.getStatus(list[list.length - 1]);
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
  postStatus: async (req, res, next) => {
    try {
      const { name, description, color } = req.body;
      if (!name)
        return res.status(Constants.ApiCode.BAD_REQUEST).json({
          status: Constants.ApiCode.BAD_REQUEST,
          message: Constants.String.Message.ERR_400(
            Constants.String.Status.NAME
          ),
        });
      const result = await statusService.post({
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
  putStatus: async (req, res, next) => {
    try {
      const { id } = req.params;
      list = id.split(".");
      const { name, description, color } = req.body;
      if (!name)
        return res.status(Constants.ApiCode.BAD_REQUEST).json({
          status: Constants.ApiCode.BAD_REQUEST,
          message: Constants.String.Message.ERR_400(
            Constants.String.Status.NAME
          ),
        });
      const result = await statusService.putStatus(list[list.length - 1], {
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
  postStatuses: async (req, res, next) => {
    try {
      const file = req.file;
      const { text, title } = req.body;
      if (file) {
        const data = fs.readFileSync(file.path);
        const index = data.toString().indexOf("\n");
        var t = data.toString();
        if (title === "true") t = t.slice(index + 1);
        const result = await statusService.postStatuses(t);
        fs.unlinkSync(file.path);
        return res.status(result.status).json(result);
      } else {
        const result = await statusService.postStatuses(text);
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
  deleteStatus: async (req, res, next) => {
    try {
      const { id } = req.params;
      list = id.split(".");
      const result = await statusService.deleteStatus(list[list.length - 1]);
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
  deleteStatuses: async (req, res, next) => {
    try {
      const { ids } = req.body;
      console.log(ids);
      const result = await statusService.deleteStatuses(ids);
      return res.status(result.status).json(result);
    } catch (error) {
      return next(error);
    }
  },
};

module.exports = statusController;

const Constants = require("../constants");
const priorityService = require("./../services/priority.service");
var fs = require("fs");

var priorityController = {
  /**
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @param {import("express").RequestHandler} next
   */
  getPriorities: async (req, res, next) => {
    try {
      const { pageNumber, limit, filter } = req.query;
      const result = await priorityService.getPriorities(
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
  getPriority: async (req, res, next) => {
    try {
      const { id } = req.params;
      list = id.split(".");
      const result = await priorityService.getPriority(list[list.length - 1]);
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
  postPriority: async (req, res, next) => {
    try {
      const { name, description, color } = req.body;
      if (!name)
        return res.status(Constants.ApiCode.BAD_REQUEST).json({
          status: Constants.ApiCode.BAD_REQUEST,
          message: Constants.String.Message.ERR_400(
            Constants.String.Priority.NAME
          ),
        });
      const result = await priorityService.post({
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
  postPriorities: async (req, res, next) => {
    try {
      const file = req.file;
      const { text, title } = req.body;
      if (file) {
        const data = fs.readFileSync(file.path);
        const index = data.toString().indexOf("\n");
        var t = data.toString();
        if (title === "true") t = t.slice(index + 1);
        const result = await priorityService.postPriorities(t);
        fs.unlinkSync(file.path);
        return res.status(result.status).json(result);
      } else {
        const result = await priorityService.postPriorities(text);
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
  putPriority: async (req, res, next) => {
    try {
      const { id } = req.params;
      list = id.split(".");
      const { name, description, color } = req.body;
      if (!name)
        return res.status(Constants.ApiCode.BAD_REQUEST).json({
          status: Constants.ApiCode.BAD_REQUEST,
          message: Constants.String.Message.ERR_400(
            Constants.String.Priority.NAME
          ),
        });
      const result = await priorityService.putPriority(list[list.length - 1], {
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
  deletePriority: async (req, res, next) => {
    try {
      const { id } = req.params;
      list = id.split(".");
      const result = await priorityService.deletePriority(
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
  deletePriorities: async (req, res, next) => {
    try {
      const { ids } = req.body;
      console.log(ids);
      const result = await priorityService.deletePriorities(ids);
      return res.status(result.status).json(result);
    } catch (error) {
      return next(error);
    }
  },
};

module.exports = priorityController;

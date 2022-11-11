const Constants = require("../constants");
const languageService = require("./../services/language.service");
var fs = require("fs");

var languageController = {
  /**
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @param {import("express").RequestHandler} next
   */
  getList: async (req, res, next) => {
    try {
      const result = await languageService.getList(req.userID);
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
  getLanguages: async (req, res, next) => {
    try {
      const { pageNumber, limit, filter } = req.query;
      const result = await languageService.getLanguages(
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
  postLanguage: async (req, res, next) => {
    try {
      const { name, notation, description, color } = req.body;
      if (!name)
        return res.status(Constants.ApiCode.BAD_REQUEST).json({
          status: Constants.ApiCode.BAD_REQUEST,
          message: Constants.String.Message.ERR_400(
            Constants.String.Language.NAME
          ),
        });
      if (!notation)
        return res.status(Constants.ApiCode.BAD_REQUEST).json({
          status: Constants.ApiCode.BAD_REQUEST,
          message: Constants.String.Message.ERR_400(
            Constants.String.Language.NOTATION
          ),
        });
      const result = await languageService.postLanguage({
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
  postLanguages: async (req, res, next) => {
    try {
      const file = req.file;
      const { text, title } = req.body;
      if (file) {
        const data = fs.readFileSync(file.path);
        const index = data.toString().indexOf("\n");
        var t = data.toString();
        if (title === "true") t = t.slice(index + 1);
        const result = await languageService.postLanguages(t);
        fs.unlinkSync(file.path);
        return res.status(result.status).json(result);
      } else {
        const result = await languageService.postLanguages(text);
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
  getLanguage: async (req, res, next) => {
    try {
      const { id } = req.params;
      list = id.split(".");
      const result = await languageService.getLanguage(list[list.length - 1]);
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
  putLanguage: async (req, res, next) => {
    try {
      const { id } = req.params;
      list = id.split(".");
      const { name, notation, description, color } = req.body;
      if (!name)
        return res.status(Constants.ApiCode.BAD_REQUEST).json({
          status: Constants.ApiCode.BAD_REQUEST,
          message: Constants.String.Message.ERR_400(
            Constants.String.Language.NAME
          ),
        });
      if (!notation)
        return res.status(Constants.ApiCode.BAD_REQUEST).json({
          status: Constants.ApiCode.BAD_REQUEST,
          message: Constants.String.Message.ERR_400(
            Constants.String.Language.NOTATION
          ),
        });
      const result = await languageService.putLanguage(list[list.length - 1], {
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
  deleteLanguage: async (req, res, next) => {
    try {
      const { id } = req.params;
      list = id.split(".");
      const result = await languageService.deleteLanguage(
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
  deleteLanguages: async (req, res, next) => {
    try {
      const { ids } = req.body;
      const result = await languageService.deleteLanguages(ids);
      return res.status(result.status).json(result);
    } catch (error) {
      return next(error);
    }
  },
};

module.exports = languageController;

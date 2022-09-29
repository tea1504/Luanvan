const Constants = require("../constants");
const languageService = require("./../services/language.service");

var languageController = {
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
          message: Constants.String.Message.ERR_400(Constants.String.Language.NAME),
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
          message: Constants.String.Message.ERR_400(Constants.String.Language.NAME),
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
      const result = await languageService.deleteLanguage(list[list.length - 1]);
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

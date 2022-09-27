const typeSevice = require("./../services/type.service");

var typeController = {
  /**
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @param {import("express").RequestHandler} next
   */
  get: async (req, res, next) => {
    try {
      const result = await typeSevice.get();
      res.status(result.code).json(result);
    } catch (error) {
      next(error);
    }
  },
};

module.exports = typeController;

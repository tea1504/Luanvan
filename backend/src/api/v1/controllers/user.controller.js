const userService = require("./../services/user.service");

var that = (module.exports = {
  /**
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @param {import("express").RequestHandler} next
   */
  login: async (req, res, next) => {
    const { userName, userPassword } = req.body;
    const result = await userService.login(userName, userPassword);
    res.status(result.code).json({ data: result.data });
  },
  /**
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @param {import("express").RequestHandler} next
   */
  getInfo: async (req, res, next) => {
    const user = await userService.getInfo(req.user.id);
    res.status(200).json(user);
  },
  /**
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @param {import("express").RequestHandler} next
   */
  updateInfo: async (req, res, next) => {
    try {
      const id = req.user.id;
      const info = ({ userName, userRole, userPassword } = req.body);
      const result = await userService.updateInfo(id, info);
      res.status(200).json({ data: result });
    } catch (error) {
      next(error);
    }
  },
});

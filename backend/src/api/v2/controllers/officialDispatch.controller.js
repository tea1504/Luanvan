const service = require("../services/officialDispatch.service");
var fs = require("fs");

var officialDispatch = {
  /**
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @param {import("express").RequestHandler} next
   */
  processOD: async (req, res, next) => {
    try {
      function sleep(ms) {
        return new Promise((r) => setTimeout(r, ms));
      }
      res.setHeader("Content-Type", "text/html");
      const file = req.file;
      const result = await service.processOD(file);
      fs.unlinkSync(file.path);
      for (var i = 0; i < 9; i++) {
        await sleep(100);
        res.write(i + "");
      }
      res.write("#");
      return res.end(JSON.stringify(result));
    } catch (error) {
      return next(error);
    }
  },
};

module.exports = officialDispatch;
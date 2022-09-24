module.exports = {
  /**
   * Lấy danh sách sách
   *
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @param {import("express").RequestHandler} next
   */
  test: async (req, res, next) => {
    function sleep(ms) {
      return new Promise((r) => setTimeout(r, ms));
    }
    res.setHeader("Content-Type", "text/html");
    for (var i = 0; i < 9; i++) {
      // await sleep(Math.floor(Math.random() * 900 + 100));
      await sleep(100);
      res.write(i + "");
    }
    res.end("9");
  },
};

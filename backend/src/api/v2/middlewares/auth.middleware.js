require("dotenv").config();
const jwt = require("jsonwebtoken");
const Constants = require("../constants");
/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").RequestHandler} next
 */
const verifyToken = async (req, res, next) => {
  const token = req.headers["x-api-key"]?.slice(7) || req.query.token;

  if (!token) {
    res
      .status(403)
      .send({ code: 403, message: Constants.String.Message.ERR_403 });
  }
  try {
    const decoded = jwt.verify(token, process.env.PRIVATEKEY);
    req.userID = decoded.id;
  } catch (error) {
    if (error.message === "jwt expired")
      res.status(401).send({
        code: 401,
        message: Constants.String.Message.ERR_401,
      });
    res.status(500).send({
      code: 500,
      message: Constants.String.Message.ERR_500,
      data: { error: error.message },
    });
  }
  next();
};

module.exports = verifyToken;

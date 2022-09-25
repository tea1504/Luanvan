require("dotenv").config();

module.exports = {
  v1: {
    path: process.env.DATABASE_V1,
  },
  v2: {
    path: process.env.DATABASE_V2,
  },
};

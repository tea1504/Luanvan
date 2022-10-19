const crypto = require("crypto");

const Helpers = {
  generateColor: () => {
    var code = "";
    while (code.length < 6)
      code = Math.floor(Math.random() * 16777215)
        .toString(16)
        .toUpperCase();
    return "#" + code;
  },
  generatePassword: (
    length = 8,
    wishList = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+=-<>?.,;:"
  ) =>
    Array.from(crypto.randomFillSync(new Uint32Array(length)))
      .map((x) => wishList[x % wishList.length])
      .join(""),
};

module.exports = Helpers;

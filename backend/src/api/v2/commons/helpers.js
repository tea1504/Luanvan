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
  randomDate: (start, end) => {
    return new Date(
      start.getTime() + Math.random() * (end.getTime() - start.getTime())
    );
  },
  toSlug: (str = "") => {
    str = str.toLowerCase();
    str = str.replace(/(à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ)/g, "a");
    str = str.replace(/(è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ)/g, "e");
    str = str.replace(/(ì|í|ị|ỉ|ĩ)/g, "i");
    str = str.replace(/(ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ)/g, "o");
    str = str.replace(/(ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ)/g, "u");
    str = str.replace(/(ỳ|ý|ỵ|ỷ|ỹ)/g, "y");
    str = str.replace(/(đ)/g, "0");
    str = str.replace(/(\s+)/g, "0");
    return str;
  },
  generatePassword: (
    length = 8,
    wishList = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz@#$&"
  ) =>
    Array.from(crypto.randomFillSync(new Uint32Array(length)))
      .map((x) => wishList[x % wishList.length])
      .join(""),
  formatDateFromString: (
    dateString = "",
    options = {
      weekday: "long",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }
  ) => {
    var date = new Date(dateString);
    const language = localStorage.getItem(Constants.StorageKeys.LANGUAGE);
    if (language) return date.toLocaleDateString(language, options);
    return date.toLocaleDateString(Constants.DefaultLanguage, options);
  },
};

module.exports = Helpers;

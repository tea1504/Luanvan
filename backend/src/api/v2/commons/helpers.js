const Helpers = {
  generateColor: () => {
    var code = "";
    while (code.length < 6)
      code = Math.floor(Math.random() * 16777215)
        .toString(16)
        .toUpperCase();
    return "#" + code;
  },
};

module.exports = Helpers;

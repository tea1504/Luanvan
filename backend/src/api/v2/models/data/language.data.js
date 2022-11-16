const Helpers = require("../../commons/helpers");

const languageData = [];
const data = [
  {
    name: "Tiếng Việt",
    notation: "vn",
    description: "",
  },
  {
    name: "Tiếng Anh",
    notation: "en",
  },
  {
    name: "Tiếng Pháp",
    notation: "fr",
  },
  {
    name: "Tiếng Trung Quốc",
    notation: "cn",
  },
];

for (var i = 0; i < data.length; i++) {
  const item = data[i];
  languageData.push({
    ...item,
    _id: Helpers.toSlug(item.notation) + "0".repeat(12 - item.notation.length),
    color: Helpers.generateColor(),
  });
}

module.exports = languageData;

const Helpers = require("../../commons/helpers");

const securityData = [];
const data = [
  {
    name: "Không",
  },
  {
    name: "Mật",
  },
  {
    name: "Tuyệt mật",
  },
  {
    name: "Tối mật",
  },
];

for (var i = 0; i < data.length; i++) {
  const item = data[i];
  securityData.push({
    ...item,
    _id: Helpers.toSlug(item.name) + "0".repeat(12 - item.name.length),
    color: Helpers.generateColor(),
  });
}

module.exports = securityData;

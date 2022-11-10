const Helpers = require("../../commons/helpers");

const priorityData = [];
const data = [
  {
    name: "Không",
  },
  {
    name: "Khẩn",
  },
  {
    name: "Thượng khẩn",
  },
  {
    name: "Hỏa tốc",
  },
];

for (var i = 0; i < data.length; i++) {
  const item = data[i];
  priorityData.push({
    ...item,
    _id: Helpers.toSlug(item.name) + "0".repeat(12 - item.name.length),
    color: Helpers.generateColor(),
  });
}

module.exports = priorityData;

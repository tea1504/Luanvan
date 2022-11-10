const Helpers = require("../../commons/helpers");

const statusData = [];
const data = [
  {
    name: "PENDING",
    description: "Chờ duyệt/cấp số",
  },
  {
    name: "APPROVED",
    description: "Đã duyệt/cấp số",
  },
  {
    name: "PROGRESSING",
    description: "Chờ xử lý",
  },
  {
    name: "PROGRESSED",
    description: "Đã xử lý",
  },
  {
    name: "REFUSE",
    description: "Từ chối",
  },
  {
    name: "LATE",
    description: "Trễ hạn xử lý",
  },
  {
    name: "IMPLEMENT",
    description: "Đã triển khai",
  },
  {
    name: "REPORTED",
    description: "Đã báo cáo",
  },
  {
    name: "RELEASE",
    description: "Đã phát hành",
  },
];

for (var i = 0; i < data.length; i++) {
  const item = data[i];
  statusData.push({
    ...item,
    _id: Helpers.toSlug(item.name) + "0".repeat(12 - item.name.length),
    color: Helpers.generateColor(),
  });
}

module.exports = statusData;

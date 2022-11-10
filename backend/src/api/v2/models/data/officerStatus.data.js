const Helpers = require("../../commons/helpers");

const officerStatusData = [];
const data = [
  {
    name: "ACTIVATED",
    description: "Tài khoản đang hoạt động",
  },
  {
    name: "NEW",
    description: "Tài khoản vừa khởi tạo",
  },
  {
    name: "LOCKED",
    description: "Tài khoản bị khóa",
  },
  {
    name: "WRONG_1",
    description: "Sai mật khẩu lần 1",
  },
  {
    name: "WRONG_2",
    description: "Sai mật khẩu lần 2",
  },
  {
    name: "WRONG_3",
    description: "Sai mật khẩu lần 3",
  },
  {
    name: "WRONG_4",
    description: "Sai mật khẩu lần 4",
  },
];

for (var i = 0; i < data.length; i++) {
  const item = data[i];
  officerStatusData.push({
    ...item,
    _id: Helpers.toSlug(item.name) + "0".repeat(12 - item.name.length),
    color: Helpers.generateColor(),
  });
}

module.exports = officerStatusData;

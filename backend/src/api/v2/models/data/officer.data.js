const bcrypt = require("bcrypt");
const password = await bcrypt.hash("12345", parseInt(process.env.SALT));
const oldPassword = await bcrypt.hash("12345", parseInt(process.env.SALT));

var result = [];
const data = [
  {
    _id: "officer00001",
    code: "000001",
    position: "Admin",
    firstName: "Hòa",
    lastName: "Trần Văn",
    emailAddress: "tranvanhoa15.042000@gmail.com",
    phoneNumber: "0786882888",
    password: [
      { _id: "officer1pass", value: password },
      { time: new Date("2022-09-25T12:54:45.880Z"), value: oldPassword },
    ],
    organ: "organ0000001",
    file: {
      name: "1.jpg",
      path: "avatars/1.jpg",
    },
    status: "officerSta01",
    right: "right0000000",
  },
];

for (var i = 0; i < data.length; i++) {
  result.push({
    ...data[i],
    emailAddress: `tranvanhoa15042000+${data[i].code}@gmail.com`,
    phoneNumber: "0" + Math.floor(Math.random() * 999999999 + 100000000),
  });
}

module.exports = result;

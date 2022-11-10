var result = [];
const data = [
  { _id: "dhct00000000", name: "Đại học Cần Thơ", code: "ĐHCT" },
  {
    _id: "cntttt000000",
    name: "Trường Công nghệ thông tin và Truyền thông",
    code: "CNTT&TT",
    organ: "dhct00000000",
  },
  {
    _id: "bk0000000000",
    name: "Trường Bách khoa",
    code: "BK",
    organ: "dhct00000000",
  },
  {
    _id: "kt0000000000",
    name: "Trường Kinh tế",
    code: "KT",
    organ: "dhct00000000",
  },
  {
    _id: "nn0000000000",
    name: "Trường Nông nghiệp",
    code: "NN",
    organ: "dhct00000000",
  },
  {
    _id: "dbdt00000000",
    name: "Khoa dự bị Dân tộc",
    code: "DBDT",
    organ: "dhct00000000",
  },
  {
    _id: "khct00000000",
    name: "Khoa Khoa học Chính trị",
    code: "KHCT",
    organ: "dhct00000000",
  },
  {
    _id: "khtn00000000",
    name: "Khoa Khoa học Tự nhiên",
    code: "KHTN",
    organ: "dhct00000000",
  },
  {
    _id: "khxhnv000000",
    name: "Khoa Khoa học Xã hội và Nhân văn",
    code: "KHXH&NV",
    organ: "dhct00000000",
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
